const canvas = document.querySelector('canvas');
canvas.width = 400;
canvas.height = 520;
const ctx = canvas.getContext('2d');
const beforeGame = document.getElementById('before-game');
const playBtn = document.getElementsByClassName('play');
const bullet = document.getElementById('bullet');
const scoreDiv = document.getElementById('score');
const scoreCount = document.getElementById('score-count');

const afterGame = document.getElementById('after-game');
const yourScore = document.getElementById('current-score');
const highScore = document.getElementById('high-score');

if (localStorage.getItem("high-score")) {
    highScore.innerHTML = localStorage.getItem("high-score");
}
const carTopPosition = 420;
const carHeight = 80;
const carHorPosition = [10, 150, 280];

let enemies = [];
let laneSpeed = 2.2;
let score = 0;
let gameOver = false;
let lanePosition = 1;
const createRoad = function() {
    const road = new Image();
    road.src = './images/road.png';
    road.onload = function() {
        let height = 0 - canvas.height;
        const animateRoad = function() {
            ctx.drawImage(road, 0, height, canvas.width, canvas.height * 2);
            height += laneSpeed;
            if (height >= 0) {
                height = 0 - canvas.height;
            }
            if (gameOver) {
                return;
            };
            requestAnimationFrame(animateRoad);
        }
        animateRoad();
    }
}

const createMyCar = function() {
    const myCar = new Image();
    myCar.src = './images/my-car.png';
    myCar.onload = function() {
        const animateMyCar = function() {
            ctx.drawImage(myCar, carHorPosition[lanePosition], carTopPosition, 110, carHeight);
            if (gameOver) {
                return
            };
            requestAnimationFrame(animateMyCar);
        }
        animateMyCar();
    }
}

const drawEnemies = function() {
    enemies = [];
    const enemy = new Enemy(0);
    const enemy2 = new Enemy(-200);
    const enemy3 = new Enemy(-410);

    createRoad();
    createMyCar();

    enemy.drawEnemy();
    enemy2.drawEnemy();
    enemy3.drawEnemy();
    enemies.push(enemy);
    enemies.push(enemy2);
    enemies.push(enemy3);

    scoreDiv.style.display = 'block';
    scoreCount.innerHTML = '0';
}

const updateHighScore = function() {
    yourScore.innerHTML = score;
    if (score > highScore.innerHTML) {
        localStorage.setItem("high-score", score);
        highScore.innerHTML = score;
    };
    score = 0;
}

const triggerMoveEvents = function(event) {
    if (event.key === 'a' || event.key === 'A') {
        if (lanePosition > 0) {
            lanePosition -= 1;
        }
    }
    if (event.key === 'd' || event.key === 'D') {
        if (lanePosition < 2) {
            lanePosition += 1;
        }
    }
}

function setMoveEvents() {
    window.addEventListener('keydown', triggerMoveEvents);
}

const increaseSpeed = function() {
    laneSpeed *= 1.0002;
    requestAnimationFrame(increaseSpeed);
}

const calculateScore = function() {
    function calculate() {
        for (enemy of enemies) {
            if (enemy.y > (canvas.height + 30) && !enemy.scored) {
                score++;
                scoreCount.innerHTML = score;
                enemy.scored = true;
            }
        }
        if (gameOver) {
            window.clearInterval(calculate);
        }
        requestAnimationFrame(calculate);
    }
    calculate();
}

function clearAllTimers() {
    let id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id);
    }
}

const handleGameOver = function() {
    window.removeEventListener('keydown', triggerMoveEvents);
    gameOver = true;
    scoreDiv.style.display = 'none';
    clearAllTimers();
    updateHighScore();
    canvas.style.display = 'none';
    afterGame.style.display = 'block';
}

function checkCollision() {
    for (let obstracle of enemies)
        if (Math.abs(carTopPosition - obstracle.y) < carHeight && obstracle.lane === lanePosition) {
            handleGameOver();
        }
    if (gameOver) {
        return;
    };
    requestAnimationFrame(checkCollision);
}

const startGame = function() {
    drawEnemies();
    gameOver = false;
    laneSpeed = 2;
    lanePosition = 1;
    setMoveEvents();
    increaseSpeed();
    calculateScore();
    checkCollision();
}

for (let btn of playBtn) {
    btn.addEventListener('click', function() {
        beforeGame.style.display = 'none';
        afterGame.style.display = 'none';
        canvas.style.display = 'block';
        startGame();
    });
}