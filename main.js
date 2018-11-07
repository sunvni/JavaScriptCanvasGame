var canvas = document.getElementById("canvas");
var textcanvas = document.getElementById("textcanvas");
var ctx = canvas.getContext("2d");
var textctx = textcanvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var game_start = false;

var score = 0;
var lives = 3;

var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
textcanvas.addEventListener("click", function (e) {
    const mousePos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    };
    const pixel = textctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    if (color != "rgb(0,129,0)" && color != "rgb(255,254,255)") return;
    if (game_start === false) {
        iniGame();
        let dn = 0;
        const countDown = 3;
        showMenu(countDown)
        let it = setInterval(function () {
            dn++;

            switch (dn) {
                case 3:
                    showMenu('READY')
                    break;
                case 4:
                    showMenu('START!');
                    game_start = true;
                    break;
                case 5:
                    clearText();
                    clearInterval(it);
                    break;
                default:
                    showMenu(countDown - dn)
                    break;
            }
        }, 1000)
    }

});

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        showMenu("YOU WIN, CONGRATULATIONS!");
                        drawButton('START');
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Consolas";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function draw() {
    if (game_start === false) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLives();
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                gameOver();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}
function iniGame() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    brickRowCount = 5;
    brickColumnCount = 3;
    brickWidth = 75;
    brickHeight = 20;
    brickPadding = 10;
    brickOffsetTop = 30;
    brickOffsetLeft = 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
}
function gameOver() {
    //iniGame();
    game_start = false;
    drawButton();
}
function showMenu(text) {
    clearText();
    textctx.beginPath();
    textctx.font = '60px Consolas';
    textctx.fillStyle = 'green';
    textctx.textAlign = 'center';
    textctx.fillText(text, textcanvas.width / 2, textcanvas.height / 2);
    textctx.closePath();
}
function drawButton() {
    textctx.beginPath();
    textctx.rect(textcanvas.width / 2 - 90, textcanvas.height / 2 - 30, 180, 60);
    textctx.fillStyle = 'rgb(0,129,0)';
    textctx.fill();
    textctx.strokeStyle = 'rgb(0, 129, 0)';
    textctx.stroke();
    textctx.closePath();
    textctx.fillStyle = 'rgb(255,254,255)';
    textctx.textAlign = "center";
    textctx.textBaseline = "middle";
    textctx.font = '60px Consolas';
    textctx.fillText('START', textcanvas.width / 2, textcanvas.height / 2 + 5);
}
function clearText() {
    textctx.clearRect(0, 0, textcanvas.width, textcanvas.height);
}
iniGame();
drawButton();
//showMenu("CLICK TO START");
setInterval(draw, 10);
