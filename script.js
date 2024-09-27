const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensions du canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Propriétés du bonhomme
const playerWidth = 50;
const playerHeight = 80;
let playerX = (canvasWidth - playerWidth) / 2;
const playerY = canvasHeight - playerHeight - 10;
const playerSpeed = 7;

// Propriétés du glaçon
const iceCubeSize = 30;
let iceCubeX = Math.random() * (canvasWidth - iceCubeSize);
let iceCubeY = -iceCubeSize;
let iceCubeSpeed = 4;
const iceCubeSpeedIncrement = 1;
const difficultyThreshold = 2;

// Contrôles du clavier
let rightPressed = false;
let leftPressed = false;

// Système de score
let score = 0;
const scoreDisplay = document.getElementById('score');

// Record (meilleur score)
let record = localStorage.getItem('record') ? parseInt(localStorage.getItem('record')) : 0;
const recordDisplay = document.getElementById('record');
recordDisplay.textContent = "Record : " + record;

// État du jeu
let gameRunning = true;

// Éléments du Game Over
const gameOverDiv = document.getElementById('gameOver');
const finalScoreSpan = document.getElementById('finalScore');
const bestScoreSpan = document.getElementById('bestScore');
const replayButton = document.getElementById('replayButton');

// Barre de progression
const liquid = document.getElementById('liquid');
const maxScore = 15;

// Conteneur pour les boutons de redirection
const redirectButtonsContainer = document.getElementById('redirectButtonsContainer');

// Paramètres de personnalisation pour les boutons de redirection
const redirectButtonSettings = [
    { text: "Video #1", link: 'https://www.youtube.com/watch?v=M9ipP5GEDVA', color: '#393c9d', fontSize: '20px' },
    { text: "Video #2", link: 'https://www.youtube.com/shorts/-F2vSIaxWDQ', color: '#f6ef27', fontSize: '20px' },
    { text: "Video #3", link: 'https://youtube.com/shorts/LSG8T-llybY', color: '#393c9d', fontSize: '20px' },
    { text: "Video #4", link: 'https://youtube.com/shorts/K725uFaYNbs', color: '#f6ef27', fontSize: '20px' },
    { text: "Video #5", link: 'https://youtube.com/shorts/sWJyGLu-Ksk', color: '#393c9d', fontSize: '20px' },
    { text: "Video #6", link: 'https://youtube.com/shorts/1nEc_MQPDe8', color: '#f6ef27', fontSize: '20px' },
    { text: "Video #7", link: 'https://youtube.com/shorts/Aa_7TALbN1c', color: '#393c9d', fontSize: '20px' },
    { text: "Jeu", link: 'https://fred7793.github.io/casserglacon/', color: '#f6ef27', fontSize: '20px' },
    // Ajoutez d'autres objets avec les paramètres que vous souhaitez pour chaque bouton
];
let buttonCounter = 0;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
replayButton.addEventListener('click', restartGame);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(playerX + playerWidth / 2, playerY + playerHeight / 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // Tête
    ctx.beginPath();
    ctx.arc(0, -20, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.stroke();

    // Chapeau triangle
    ctx.beginPath();
    ctx.moveTo(-20, -35);
    ctx.lineTo(0, -60);
    ctx.lineTo(20, -35);
    ctx.closePath();
    ctx.fillStyle = "#DAA520";
    ctx.fill();
    ctx.stroke();

    // Yeux et bouche
    ctx.beginPath();
    ctx.moveTo(-8, -25);
    ctx.lineTo(-2, -25);
    ctx.moveTo(2, -25);
    ctx.lineTo(8, -25);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -15, 7, 0, Math.PI, false);
    ctx.stroke();

    // Corps
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 30);
    ctx.stroke();

    // Bras
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-20, 10);
    ctx.moveTo(0, 0);
    ctx.lineTo(20, 10);
    ctx.stroke();

    // Jambes
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(-15, 50);
    ctx.moveTo(0, 30);
    ctx.lineTo(15, 50);
    ctx.stroke();
    ctx.restore();
}

function drawIceCube() {
    ctx.save();
    ctx.translate(iceCubeX, iceCubeY);
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(0, 0, iceCubeSize, iceCubeSize);
    ctx.strokeStyle = '#87CEEB';
    ctx.strokeRect(0, 0, iceCubeSize, iceCubeSize);
    ctx.restore();
}

function movePlayer() {
    if (rightPressed && playerX < canvasWidth - playerWidth) {
        playerX += playerSpeed;
    }
    if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }
}

function moveIceCube() {
    iceCubeY += iceCubeSpeed;
}

function resetIceCube() {
    iceCubeX = Math.random() * (canvasWidth - iceCubeSize);
    iceCubeY = -iceCubeSize;
}

function increaseDifficulty() {
    iceCubeSpeed += iceCubeSpeedIncrement;
}

function updateProgressBar() {
    let scoreInGlass = score % maxScore;
    let percentage = (scoreInGlass / maxScore) * 100;
    liquid.style.height = percentage + '%';
}

function detectCollision() {
    if (iceCubeY + iceCubeSize > playerY &&
        iceCubeX + iceCubeSize > playerX &&
        iceCubeX < playerX + playerWidth) {
        score++;
        scoreDisplay.textContent = "Score : " + score;
        resetIceCube();
        updateProgressBar();

        if (score % 2 === 0) {
            addRedirectButton();
        }

        if (score % difficultyThreshold === 0) {
            increaseDifficulty();
        }
        if (score % maxScore === 0) {
            liquid.style.height = '0%';
        }
    } else if (iceCubeY > canvasHeight) {
        gameOver();
    }
}

function addRedirectButton() {
    if (buttonCounter < redirectButtonSettings.length) {
        const settings = redirectButtonSettings[buttonCounter];
        const button = document.createElement('button');
        
        // Appliquer les propriétés personnalisées
        button.textContent = settings.text;
        button.style.backgroundColor = settings.color;
        button.style.fontSize = settings.fontSize;
        button.style.margin = '5px';
        button.style.color = '#fff'; // Pour garantir que le texte est visible sur les boutons colorés
        button.style.padding = '10px 15px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.onclick = () => window.open(settings.link, '_blank');
        redirectButtonsContainer.appendChild(button);
        buttonCounter++;
    }
}

function gameOver() {
    gameRunning = false;
    if (score > record) {
        record = score;
        localStorage.setItem('record', record);
        recordDisplay.textContent = "Record : " + record;
    }
    finalScoreSpan.textContent = score;
    bestScoreSpan.textContent = record;
    gameOverDiv.style.display = 'block';
}

function restartGame() {
    score = 0;
    iceCubeSpeed = 4;
    scoreDisplay.textContent = "Score : " + score;
    playerX = (canvasWidth - playerWidth) / 2;
    resetIceCube();
    gameRunning = true;
    gameOverDiv.style.display = 'none';
    liquid.style.height = '0%';
    redirectButtonsContainer.innerHTML = ''; // Réinitialise les boutons
    buttonCounter = 0;
    draw();
}

function draw() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPlayer();
    drawIceCube();
    movePlayer();
    moveIceCube();
    detectCollision();
    requestAnimationFrame(draw);
}

draw();
