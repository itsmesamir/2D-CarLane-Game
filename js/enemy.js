class Enemy {
    constructor(y) {
        var self = this;
        this.y = y;
        this.scored = false;
        this.lane = Math.floor(Math.random() * 3);
    }

    drawEnemy = function() {
        var enemyCar = new Image();
        enemyCar.src = './images/enemy.png';
        enemyCar.onload = () => {
            const drawEnemyCar = () => {
                if (this.y > canvas.height + 30) {
                    this.scored = false;
                    enemyCar.src = './images/enemy.png';
                    this.y = -500;
                    this.lane = Math.floor(Math.random() * 3);
                    return;
                }
                ctx.drawImage(enemyCar, carHorPosition[this.lane], this.y, 110, carHeight);
                this.y += 1.5 * laneSpeed;
                if (gameOver) {
                    return
                };
                requestAnimationFrame(drawEnemyCar);
            }
            drawEnemyCar();
        }
    }
}