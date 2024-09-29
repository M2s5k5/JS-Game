let currentLevel = 1;
const maxEnemies = 20;

function getEnemyCountForLevel(level) {
    // Formula za broj neprijatelja na osnovu nivoa, s maksimalnim brojem 20
    return Math.min(15 + level, maxEnemies);
}

function advanceToNextLevel() {
    currentLevel++;
    if (currentLevel > 4) {
        currentLevel = 4; // Maksimalni nivo je 4
    }

    spawnFormation();
    requestAnimationFrame(draw);
}

function spawnFormation() {
    enemies = [];
    let enemyCount = getEnemyCountForLevel(currentLevel);

    const rows = currentLevel + 2; // Broj redova raste s nivoom
    const cols = Math.ceil(enemyCount / rows); // Broj kolona na osnovu broja neprijatelja
    const enemySize = 30;
    const spacing = 10;
    const startX = (canvas.width - (cols * (enemySize + spacing))) / 2;
    const startY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (enemyCount-- > 0) {
                enemies.push({
                    x: startX + col * (enemySize + spacing),
                    y: startY + row * (enemySize + spacing),
                    width: enemySize,
                    height: enemySize,
                    stopY: startY + row * (enemySize + spacing),
                    health: 1 // Dodaj health ili neki indikator života
                });
            }
        }
    }
}
