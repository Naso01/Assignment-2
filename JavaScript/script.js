// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var playerBtn = document.getElementById("player-btn");
//left radiobuttons
var leftClassicBtn = document.getElementById("left-classic");
var leftRedBtn = document.getElementById("left-red");
var leftGreenBtn = document.getElementById("left-green");
var leftBlueBtn = document.getElementById("left-blue");
//right radiobuttons
var rightClassicBtn = document.getElementById("right-classic");
var rightRedBtn = document.getElementById("right-red");
var rightGreenBtn = document.getElementById("right-green");
var rightBlueBtn = document.getElementById("right-blue");

//Classic color default
leftClassicBtn.checked = true;
rightClassicBtn.checked = true;

var animationId;
var gameRunning = false;

//timer value
var time = 3;

//Ai or Player (right paddle) Selection
var aiActive = true;

startBtn.addEventListener("click", function() {
  if (!gameRunning) { // only start the game if gameRunning is false
    gameRunning = true; // set gameRunning to true when the game starts

    let timer = time;

    let interval = setInterval(function updateCountdown(){
      draw();
      ctx.fillStyle = "#989aac";
      ctx.font = "50px Arial";
      // canvas.width - 314 , canvas.height -300 for original config
      ctx.fillText(timer, canvas.width - 314 , canvas.height -300);
      if (timer< 1){
        clearInterval(interval);
        loop();
      }
      timer--;
    }, 1000);
  }
});

pauseBtn.addEventListener("click", function() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  document.But
});

restartBtn.addEventListener("click", function() {
  document.location.reload();
});

playerBtn.addEventListener("click", function() {

  if(aiActive== true){
    aiActive = false;
    document.getElementById("player-btn").innerHTML = "Player vs Player"
  }else{
      aiActive = true;
      document.getElementById("player-btn").innerHTML = "Player vs AI"
  }
  if (aiActive == false) {rightPaddleSpeed = leftPaddleSpeed;}
  
});

addEventListener("load", (event) => {
  draw();
});


// Define ball properties
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 3;
var ballSpeedY = 3;
var absoluteBallSpeedX = ballSpeedX;

// Define paddle properties
var paddleHeight = 80;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var leftPaddleSpeed = 5;
var rightPaddleSpeed;
if (aiActive == true) {rightPaddleSpeed = leftPaddleSpeed -2;}

// Define score properties
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 20;

// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key press
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}

// Handle key release
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}

// Update game state
function update() {

  //AI Logic
  function AiLogic(){
  // Move right paddle automatically based on ball position
    if (ballY > rightPaddleY + paddleHeight / 2) {
      rightPaddleY += rightPaddleSpeed;
    } else if (ballY < rightPaddleY + paddleHeight / 2) {
      rightPaddleY -= rightPaddleSpeed;
    }
  
    // Check if ball goes out of bounds on left or right side of canvas
    if (ballX < 0) {
      //AI paddle gets slower when it scores
      if (rightPaddleSpeed > 1){
        rightPaddleSpeed--;
      }
    } else if (ballX > canvas.width) {
      //AI paddle gets faster when player scores
      rightPaddleSpeed++;
    }
    if (rightPlayerScore === maxScore) {
      playerWin("The Ai");
    }
  }
  //activate Ai
  if (aiActive == true) {AiLogic();}
    
   //Move right paddle based on "up" and "down" arrow keys
  if (aiActive == false){
    if (upPressed && rightPaddleY > 0) {
      rightPaddleY -= rightPaddleSpeed;
    } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
      rightPaddleY += rightPaddleSpeed;
    }
  }

  // Move left paddle based on "w" and "s" keys
  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= leftPaddleSpeed;
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += leftPaddleSpeed;
  }
  
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Check if ball collides with top or bottom of canvas
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Check if ball collides with left paddle
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX += 1;
    ballSpeedY += 1;
    ballSpeedX = -ballSpeedX;
    
  }

  // Check if ball collides with right paddle
  // for right player (2nd player)
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX += 1;
    ballSpeedY += 1;
    ballSpeedX = -ballSpeedX;
    
  }


  // Check if ball goes out of bounds on left or right side of canvas
  if (ballX < 0) {
    rightPlayerScore++;
    reset();

  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  // Check if a player or Ai has won
  if (leftPlayerScore === maxScore) {
    playerWin("Left player");
  } else if (rightPlayerScore === maxScore) {
    if (aiActive == false) {playerWin("Right player");}
  }
}

function playerWin(player) {
  var message = "Congratulations! " + player + " Wins!";
  $('#message').text(message); // Set the message text
  $('#message-modal').modal('show'); // Display the message modal
  reset();
}

// Reset ball to center of screen
function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  absoluteBallSpeedX = -absoluteBallSpeedX;
  ballSpeedX = 0;
  ballSpeedY = 0;

  window.setTimeout(function(){
    ballSpeedX = absoluteBallSpeedX;
  ballSpeedY = Math.random() * 10 - 5;},500);
}

// Draw objects on canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF";
  ctx.font = "15px Arial";

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF"; // Set line color to white
  ctx.stroke();
  ctx.closePath();

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Draw left paddle
  if(leftClassicBtn.checked == true) {ctx.fillStyle = leftClassicBtn.value;}
  if(leftRedBtn.checked == true) {ctx.fillStyle = leftRedBtn.value;}
  if(leftGreenBtn.checked == true) {ctx.fillStyle = leftGreenBtn.value;}
  if(leftBlueBtn.checked == true) {ctx.fillStyle = leftBlueBtn.value;}
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  // Draw left scores
  ctx.fillText("Score: " + leftPlayerScore, 10, 20);

  // Draw right paddle
  if(rightClassicBtn.checked == true) {ctx.fillStyle = rightClassicBtn.value;}
  if(rightRedBtn.checked == true) {ctx.fillStyle = rightRedBtn.value;}
  if(rightGreenBtn.checked == true) {ctx.fillStyle = rightGreenBtn.value;}
  if(rightBlueBtn.checked == true) {ctx.fillStyle = rightBlueBtn.value;}
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
  // Draw right scores
  ctx.fillText("Score: " + rightPlayerScore, canvas.width - 70, 20);

}

// Game loop
function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

$('#message-modal-close').on('click', function() {
  document.location.reload();
});