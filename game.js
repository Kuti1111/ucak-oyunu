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

// Oyuncu özellikleri
let planeX = canvas.width / 2;
let planeY = canvas.height - 100;
let planeSpeed = 10;
let planeWidth = 50;
let planeHeight = 50;

// Skor ve cephane
let score = 0;
let ammo = 10; // Başlangıç cephanesi
const maxAmmo = 10;
let isReloading = false;

// Düşmanlar
let enemies = [];
let enemySpeed = 0.5; // Başlangıç hızı

// Cephane göstergesini güncelle
function updateAmmo() {
    const ammoDisplay = document.getElementById('ammo');
    if (isReloading) {
        ammoDisplay.textContent = `Cephane: Dolduruluyor...`;
    } else {
        ammoDisplay.textContent = `Cephane: ${ammo}`;
    }
}

// Skoru güncelle
function updateScore() {
    document.getElementById('score').textContent = `Skor: ${score}`;
}

// Uçağı çiz
function drawPlane() {
    ctx.drawImage(playerImg, planeX, planeY, planeWidth, planeHeight);
}

// Uçağı hareket ettir
document.addEventListener('keydown', movePlane);
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

// Cephane doldur
document.addEventListener('keydown', reloadAmmo);
function reloadAmmo(event) {
    if (event.key === 'r' && !isReloading && ammo < maxAmmo) {
        isReloading = true;
        updateAmmo();
        setTimeout(() => {
            ammo = maxAmmo;
            isReloading = false;
            updateAmmo();
        }, 2000); // 2 saniyede cephane doluyor
    }
}

// Mermileri çiz
let bullets = [];
function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 10;
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

        // Ekran dışına çıkan mermiyi sil
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Mermi at
document.addEventListener('keydown', shootBullet);
function shootBullet(event) {
    if ((event.key === ' ' || event.key === 'Enter') && ammo > 0 && !isReloading) {
        bullets.push({ x: planeX + planeWidth / 2 - 10, y: planeY, width: 20, height: 40 });
        ammo--;
        updateAmmo();
    }
}

// Düşmanları çiz
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed; // Düşmanlar hızla hareket eder
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

        // Çarpışma kontrolü (mermi ve düşman)
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                score += 10;
                updateScore();
            }
        });

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

// Düşman üret
function generateEnemy() {
    if (Math.random() < 0.01) {
        enemies.push({ x: Math.random() * (canvas.width - 50), y: -50, width: 50, height: 50 });
    }
}

// Zorluk seviyesini artır
function increaseDifficulty() {
    if (score % 100 === 0 && score !== 0) {
        enemySpeed += 0.1; // Her 100 puanda hız artar
    }
}

// Oyun döngüsü
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Ekranı temizle
    drawPlane(); // Uçağı çiz
    drawBullets(); // Mermileri çiz
    generateEnemy(); // Yeni düşman oluştur
    drawEnemies(); // Düşmanları çiz
    increaseDifficulty(); // Zorluk artır
    requestAnimationFrame(gameLoop); // Döngüyü başlat
}

// Oyunu başlat
updateAmmo();
updateScore();
gameLoop();
