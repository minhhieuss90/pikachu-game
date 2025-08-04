// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Game state
let gameRunning = true;
let score = 0;
let gameSpeed = 1.5;

// Pikachu object
const pikachu = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    velocityY: 0,
    isJumping: false,
    color: '#FFD700'
};

// Obstacles array
let obstacles = [];
let clouds = [];

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Game functions
function drawPikachu() {
    // Draw Pikachu body (more rounded)
    ctx.fillStyle = pikachu.color;
    ctx.beginPath();
    ctx.arc(pikachu.x + pikachu.width/2, pikachu.y + pikachu.height/2, pikachu.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Add body shadow
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(pikachu.x + pikachu.width/2, pikachu.y + pikachu.height/2 + 5, pikachu.width/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Pikachu ears (more pointed)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(pikachu.x + 8, pikachu.y - 5);
    ctx.lineTo(pikachu.x + 12, pikachu.y - 20);
    ctx.lineTo(pikachu.x + 16, pikachu.y - 5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(pikachu.x + 24, pikachu.y - 5);
    ctx.lineTo(pikachu.x + 28, pikachu.y - 20);
    ctx.lineTo(pikachu.x + 32, pikachu.y - 5);
    ctx.fill();
    
    // Draw Pikachu eyes (bigger and cuter)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pikachu.x + 15, pikachu.y + 12, 4, 0, Math.PI * 2);
    ctx.arc(pikachu.x + 25, pikachu.y + 12, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add eye highlights
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(pikachu.x + 13, pikachu.y + 10, 1.5, 0, Math.PI * 2);
    ctx.arc(pikachu.x + 23, pikachu.y + 10, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Pikachu cheeks (bigger and redder)
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.arc(pikachu.x + 8, pikachu.y + 18, 5, 0, Math.PI * 2);
    ctx.arc(pikachu.x + 32, pikachu.y + 18, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Pikachu nose
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pikachu.x + 20, pikachu.y + 15, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Pikachu mouth (happier)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pikachu.x + 20, pikachu.y + 22, 6, 0, Math.PI);
    ctx.stroke();
    
    // Draw Pikachu tail (lightning bolt shape)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(pikachu.x - 5, pikachu.y + 15);
    ctx.lineTo(pikachu.x - 15, pikachu.y + 10);
    ctx.lineTo(pikachu.x - 10, pikachu.y + 5);
    ctx.lineTo(pikachu.x - 20, pikachu.y);
    ctx.lineTo(pikachu.x - 15, pikachu.y + 5);
    ctx.lineTo(pikachu.x - 5, pikachu.y + 10);
    ctx.fill();
}

function updatePikachu() {
    // Handle movement
    if (keys['ArrowLeft'] && pikachu.x > 0) {
        pikachu.x -= 5;
    }
    if (keys['ArrowRight'] && pikachu.x < canvas.width - pikachu.width) {
        pikachu.x += 5;
    }
    
    // Handle jumping
    if (keys['Space'] && !pikachu.isJumping) {
        pikachu.velocityY = -15;
        pikachu.isJumping = true;
    }
    
    // Apply gravity
    pikachu.velocityY += 0.8;
    pikachu.y += pikachu.velocityY;
    
    // Ground collision
    if (pikachu.y > 300) {
        pikachu.y = 300;
        pikachu.velocityY = 0;
        pikachu.isJumping = false;
    }
}

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: 300,
        width: 20,
        height: 40,
        color: '#8B4513'
    };
    obstacles.push(obstacle);
}

function createCloud() {
    const cloud = {
        x: canvas.width,
        y: Math.random() * 150 + 50,
        width: 60,
        height: 30,
        speed: Math.random() * 2 + 1
    };
    clouds.push(cloud);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Draw tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Draw tree bark pattern
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        for (let i = 0; i < obstacle.height; i += 8) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y + i);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + i);
            ctx.stroke();
        }
        
        // Draw tree leaves on top
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width/2, obstacle.y - 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some grass at the base
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(obstacle.x - 2, obstacle.y + obstacle.height, obstacle.width + 4, 5);
    });
}

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2);
        ctx.arc(cloud.x + 20, cloud.y, 15, 0, Math.PI * 2);
        ctx.arc(cloud.x + 40, cloud.y, 20, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score += 10;
            scoreElement.textContent = score;
        }
    }
}

function updateClouds() {
    for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].x -= clouds[i].speed;
        if (clouds[i].x + clouds[i].width < 0) {
            clouds.splice(i, 1);
        }
    }
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (pikachu.x < obstacle.x + obstacle.width &&
            pikachu.x + pikachu.width > obstacle.x &&
            pikachu.y < obstacle.y + obstacle.height &&
            pikachu.y + pikachu.height > obstacle.y) {
            gameOver();
        }
    });
}

function drawGround() {
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, 350, canvas.width, 50);
    
    // Draw grass pattern
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 350);
        ctx.lineTo(i + 10, 340);
        ctx.stroke();
    }
}

function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(700, 80, 30, 0, Math.PI * 2);
    ctx.fill();
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
    
    // Add click event for restart button
    document.querySelector('.restart-btn').onclick = restartGame;
}

function restartGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 1.5;
    pikachu.x = 50;
    pikachu.y = 300;
    pikachu.velocityY = 0;
    pikachu.isJumping = false;
    obstacles = [];
    clouds = [];
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    
    // Restart the game loop
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    drawGround();
    
    // Update and draw game objects
    updatePikachu();
    drawPikachu();
    
    // Obstacles
    if (Math.random() < 0.01) {
        createObstacle();
    }
    updateObstacles();
    drawObstacles();
    
    // Clouds
    if (Math.random() < 0.01) {
        createCloud();
    }
    updateClouds();
    drawClouds();
    
    // Check collisions
    checkCollision();
    
    // Increase game speed over time
    if (score > 0 && score % 200 === 0) {
        gameSpeed += 0.05;
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 
