const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let planeX = canvas.width / 2;
let planeY = canvas.height - 100;
let planeSpeed = 10;
let planeWidth = 50;
let planeHeight = 50;
let score = 0;

let bullets = [];
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
        bullets.push({ x: planeX + planeWidth / 2 - 5, y: planeY, width: 10, height: 20 });
    }
}

function drawPlane() {
    ctx.fillStyle = 'red';
    ctx.fillRect(planeX, planeY, planeWidth, planeHeight);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach((bullet, index) => {
        bullet.y -= 10;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Bullets off-screen
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function generateEnemy() {
    if (Math.random() < 0.01) {  // Düşman oluşma oranı daha da düşürüldü
        let enemyX = Math.random() * (canvas.width - 50);
        let enemyY = -50;
        enemies.push({ x: enemyX, y: enemyY, width: 50, height: 50 });
    }
}

function drawEnemies() {
    ctx.fillStyle = 'green';
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Collision detection with bullets
        bullets.forEach((bullet, bIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Remove enemy and bullet
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                score += 10;
            }
        });

        // Remove enemy if off-screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function updateScore() {
    document.getElementById('score').textContent = `Skor: ${score}`;
}

function increaseDifficulty() {
    if (score % 200 === 0 && enemySpeed < 1) { // Her 200 puanda hız artar
        enemySpeed += 0.05;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlane();
    drawBullets();
    generateEnemy();
    drawEnemies();
    increaseDifficulty();  // Zorluk artışı
    updateScore();
    requestAnimationFrame(gameLoop);
}

gameLoop();
