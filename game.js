const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Görseller
const playerImg = new Image();
playerImg.src = 'player_transparent.png'; // Oyuncu uçağı

const enemyImg = new Image();
enemyImg.src = 'enemy_darkened.png'; // Düşman uçağı

const bulletImg = new Image();
bulletImg.src = 'bullet.png'; // Mermi görseli

let planeX = canvas.width / 2;
let planeY = canvas.height - 100;
let planeSpeed = 10;
let planeWidth = 50;
let planeHeight = 50;
let score = 0;

let bullets = []; // Bu tanım eksikse oyun hata verebilir
let enemies = [];
let enemySpeed = 0.2;

document.addEventListener('keydown', movePlane);
document.addEventListener('keydown', shootBullet);

function movePlane(event) {
    if (event.key === 'ArrowLeft' && planeX > 0) {
        planeX -= planeSpeed;
    }
    if (event.key === 'ArrowRight' && planeX < canvas.width - planeWidth) {
        planeX += planeSpeed;
    }
    if (event.key === 'ArrowUp' && planeY > 0) {
        planeY -= planeSpeed;
    }
    if (event.key === 'ArrowDown' && planeY < canvas.height - planeHeight) {
        planeY += planeSpeed;
    }
}

function shootBullet(event) {
    if (event.key === ' ' || event.key === 'Enter') {
        bullets.push({ x: planeX + planeWidth / 2 - 10, y: planeY, width: 20, height: 40 });
    }
}

function drawPlane() {
    ctx.drawImage(playerImg, planeX, planeY, planeWidth, planeHeight);
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 10; // Mermi yukarı doğru hareket eder
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

        // Mermi ekran dışına çıktıysa sil
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function generateEnemy() {
    if (Math.random() < 0.01) {
        let enemyX = Math.random() * (canvas.width - 50);
        let enemyY = -50;
        enemies.push({ x: enemyX, y: enemyY, width: 50, height: 50 });
    }
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

        // Çarpışma algılama (mermi ve düşman)
        bullets.forEach((bullet, bIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Düşman ve mermiyi sil
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                score += 10;
            }
        });

        // Ekran dışına çıkan düşmanları sil
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function updateScore() {
    document.getElementById('score').textContent = `Skor: ${score}`;
}

function increaseDifficulty() {
    if (score % 200 === 0 && enemySpeed < 1) {
        enemySpeed += 0.05;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlane();
    drawBullets();
    generateEnemy();
    drawEnemies();
    increaseDifficulty();
    updateScore();
    requestAnimationFrame(gameLoop);
}

gameLoop();
