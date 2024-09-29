const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const player1 = {
    x: 200,
    y: canvas.height - 40,
    width: 20,
    height: 20,
    color: 'red',
    dx: 0,
    dy: 0,
    bullets: [],
    hit: false,
    ammo: 15
};

const player2 = {
    x: 600,
    y: canvas.height - 40,
    width: 20,
    height: 20,
    color: 'blue',
    dx: 0,
    dy: 0,
    bullets: [],
    hit: false,
    ammo: 15
};

let currentLevel = 1;
let enemies = [];
let enemyBullets = [];
const bulletSpeed = -5;
const enemyBulletSpeed = 2;
const enemySpeed = 1.5;
let enemyMoveDirection = 1;
const enemyFormationSpeed = 2;
const formationYLimit = canvas.height / 2 - 50;
const playerMoveLimit = canvas.height / 2;
let initialEnemyCount = 0;
let yellowCircles = [];

// Function to spawn enemies
function spawnFormation() {
    enemies = [];
    initialEnemyCount = (currentLevel + 1) * 5;

    const rows = currentLevel + 2;
    const cols = initialEnemyCount;
    const enemySize = 30;
    const spacing = 10;
    const startX = (canvas.width - (cols * (enemySize + spacing))) / 2;
    const startY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: startX + col * (enemySize + spacing),
                y: startY + row * (enemySize + spacing),
                width: enemySize,
                height: enemySize,
                stopY: startY + row * (enemySize + spacing)
            });
        }
    }
}

//draw yellow municiju koja pada
// Function to draw yellow circles
function drawYellowCircles() {
    ctx.fillStyle = 'yellow';
    yellowCircles.forEach(circle => {
        // Ažuriraj y poziciju za pad
        circle.y += circle.dy;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

    // Ukloni krugove koji su pali ispod ekrana
    yellowCircles = yellowCircles.filter(circle => circle.y < canvas.height);
}

// Function to draw the player
function drawPlayer(player) {
    ctx.fillStyle = player.hit ? 'gray' : player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Function to move the player
function movePlayer(player) {
    if (!player.hit) {
        player.x += player.dx;
        player.y += player.dy;

        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y < playerMoveLimit) player.y = playerMoveLimit;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
    }
}

// Function to shoot bullets
function shootBullet(player) {
    if (!player.hit && player.ammo > 0) {
        player.bullets.push({ x: player.x + player.width / 2, y: player.y, dy: bulletSpeed });
        player.ammo--;
    }
}

// Function to draw bullets
function drawBullets(player) {
    player.bullets.forEach(bullet => {
        bullet.y += bullet.dy;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
    player.bullets = player.bullets.filter(bullet => bullet.y > 0);
}

// Function to draw ammo count
function drawAmmo() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Ammo: ${player1.ammo}`, 10, canvas.height - 20);
    ctx.fillText(`Ammo: ${player2.ammo}`, canvas.width - 70, canvas.height - 20);
}

// Function to move enemies
function moveEnemies() {
    enemies.forEach(enemy => {
        if (enemy.y < formationYLimit && enemy.y < enemy.stopY) {
            enemy.y += enemySpeed;
        }
    });

    const leftMostEnemy = Math.min(...enemies.map(enemy => enemy.x));
    const rightMostEnemy = Math.max(...enemies.map(enemy => enemy.x + enemy.width));

    if (leftMostEnemy <= 0 || rightMostEnemy >= canvas.width) {
        enemyMoveDirection *= -1;
    }

    enemies.forEach(enemy => {
        enemy.x += enemyFormationSpeed * enemyMoveDirection;
    });
}

// Function to draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Function for enemy shooting
function enemyShoot() {
    let bulletCount = enemies.length > initialEnemyCount / 2 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < bulletCount; i++) {
        const randomEnemyIndex = Math.floor(Math.random() * enemies.length);
        const enemy = enemies[randomEnemyIndex];
        enemyBullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height, dy: enemyBulletSpeed });
    }
}

// Periodic enemy shooting
function startEnemyShooting() {
    setInterval(() => {
        enemyShoot();
    }, 2000);
}

// Function to draw enemy bullets
function drawEnemyBullets() {
    enemyBullets.forEach(bullet => {
        bullet.y += bullet.dy;
        ctx.fillStyle = 'purple';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
    enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height);
}

// Function to check collisions
// Function to check collisions
function checkBulletCollision() {
    const allBullets = [...player1.bullets, ...player2.bullets]; // Combine both players' bullets

    allBullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width && bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                enemies.splice(enemyIndex, 1);
                if (bullet === player1.bullets[bulletIndex]) {
                    player1.bullets.splice(bulletIndex, 1);
                } else {
                    player2.bullets.splice(bulletIndex, 1);
                }

                // Logic for dropping yellow circles
                if (Math.random() < 0.2) {
                    yellowCircles.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height, radius: 10, dy: 2 });
                }
            }
        });
    });

    // Logic to collect yellow circles
    yellowCircles.forEach((circle, index) => {
        // Check if player1 collects the circle
        if (circle.y + circle.radius > player1.y && circle.y - circle.radius < player1.y + player1.height &&
            circle.x + circle.radius > player1.x && circle.x - circle.radius < player1.x + player1.width) {
            player1.ammo += 5; // Add 5 ammo to player1
            yellowCircles.splice(index, 1); // Remove the circle
        }

        // Check if player2 collects the circle
        if (circle.y + circle.radius > player2.y && circle.y - circle.radius < player2.y + player2.height &&
            circle.x + circle.radius > player2.x && circle.x - circle.radius < player2.x + player2.width) {
            player2.ammo += 5; // Add 5 ammo to player2
            yellowCircles.splice(index, 1); // Remove the circle
        }
    });

    enemyBullets.forEach((bullet, bulletIndex) => {
        const bulletBottom = bullet.y + 10;
        const bulletTop = bullet.y;

        if (bullet.x > player1.x && bullet.x < player1.x + player1.width && bulletBottom > player1.y && bulletTop < player1.y + player1.height) {
            player1.hit = true;
            enemyBullets.splice(bulletIndex, 1);
        }

        if (bullet.x > player2.x && bullet.x < player2.x + player2.width && bulletBottom > player2.y && bulletTop < player2.y + player2.height) {
            player2.hit = true;
            enemyBullets.splice(bulletIndex, 1);
        }
    });
}


// Game loop
let animationFrameId;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(player1);
    drawPlayer(player2);
    drawBullets(player1);
    drawBullets(player2);
    drawEnemies();
    drawEnemyBullets();
    drawYellowCircles();
    drawAmmo();
    checkBulletCollision();
    movePlayer(player1);
    movePlayer(player2);
    moveEnemies();

    animationFrameId = requestAnimationFrame(draw);
}

// Keyboard input handling
window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') player1.dx = -2;
    else if (e.key === 'ArrowRight') player1.dx = 2;
    else if (e.key === 'ArrowUp') player1.dy = -2;
    else if (e.key === 'ArrowDown') player1.dy = 2;
    else if (e.key === 'Enter') shootBullet(player1);
    else if (e.key === 'a') player2.dx = -2;
    else if (e.key === 'd') player2.dx = 2;
    else if (e.key === 'w') player2.dy = -2;
    else if (e.key === 's') player2.dy = 2;
    else if (e.key === ' ') shootBullet(player2);
});

window.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player1.dx = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player1.dy = 0;
    if (e.key === 'a' || e.key === 'd') player2.dx = 0;
    if (e.key === 'w' || e.key === 's') player2.dy = 0;
});

// Function to restart the game
function restartGame() {
    player1.x = 200;
    player1.y = canvas.height - 40;
    player1.bullets = [];
    player1.ammo = 15;
    player1.hit = false;

    player2.x = 600;
    player2.y = canvas.height - 40;
    player2.bullets = [];
    player2.ammo = 15;
    player2.hit = false;

    enemies = [];
    enemyBullets = [];
    spawnFormation();

    toggleMenu();
}

// Event listener for "Restart" button in the menu
document.getElementById('restart').addEventListener('click', restartGame);

// Menu functionality
let isPaused = false;
function toggleMenu() {
    const menu = document.getElementById('menu');
    isPaused = !isPaused;
    if (isPaused) {
        menu.style.display = 'block';  // Show the menu
        cancelAnimationFrame(animationFrameId); // Pause the game
    } else {
        menu.style.display = 'none';  // Hide the menu
        requestAnimationFrame(draw);  // Continue the game
    }
}

// Show/hide menu on 'P' press
window.addEventListener('keydown', function (e) {
    if (e.key === 'p' || e.key === 'P') {
        toggleMenu();
    }
});

// Start the game
spawnFormation();
startEnemyShooting();
requestAnimationFrame(draw);
