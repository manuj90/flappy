const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');
const lightBtn = document.getElementById('light-start');
const darkBtn = document.getElementById('dark-start');

const flappyDay = new Image();
flappyDay.src = '/assets/bird.webp';

const flappyNight = new Image();
flappyNight.src = '/assets/bat.webp';

let avatar;
let color;

const FLAP_SPEED = -5;
const AVATAR_WIDTH = 30;
const AVATAR_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

let avatarX = 50;
let avatarY = 50;
let avatarVelocity = 0;
let avatarAceleration = 0.1;

let pipeX = 400;
let pipeY = canvas.height - 200;

let scoreScreen = document.getElementById('score-display');
let score = 0;
let highScore = 0;
let scored = false;

document.body.onkeyup = function (e) {
  if (e.code === 'Space') {
    avatarVelocity = FLAP_SPEED;
  }
};

document.getElementById('start-over').addEventListener('click', function () {
  closeEndMenu();
  resetGame();
  loop();
});

const increaseScore = () => {
  if (
    avatarX > pipeX + PIPE_WIDTH &&
    (avatarX < pipeY + PIPE_GAP ||
      avatarY + AVATAR_HEIGHT > pipeY + PIPE_GAP) &&
    !scored
  ) {
    score++;
    scoreScreen.innerHTML = score;
    scored = true;
  }

  if (avatarX < pipeX + PIPE_WIDTH) {
    scored = false;
  }
};

const collisionCheck = () => {
  const avatarBox = {
    x: avatarX,
    y: avatarY,
    width: AVATAR_WIDTH,
    height: AVATAR_HEIGHT,
  };

  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + AVATAR_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY,
  };

  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + AVATAR_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP,
  };

  if (
    avatarBox.x + avatarBox.width > topPipeBox.x &&
    avatarBox.x < topPipeBox.x + topPipeBox.width &&
    avatarBox.y < topPipeBox.y
  ) {
    return true;
  }

  if (
    avatarBox.x + avatarBox.width > bottomPipeBox.x &&
    avatarBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    avatarBox.y + avatarBox.height > bottomPipeBox.y
  ) {
    return true;
  }

  if (avatarY < 0 || avatarY + AVATAR_HEIGHT > canvas.height) {
    return true;
  }

  return false;
};

const endMenu = () => {
  document.getElementById('end-menu').style.display = 'block';
  gameContainer.classList.add('bluried');
  document.getElementById('end-score').innerHTML = score;
  document.getElementById('best-score').innerHTML = highScore;
  if (highScore < score) {
    highScore = score;
  }
};

const closeEndMenu = () => {
  document.getElementById('end-menu').style.display = 'none';
  gameContainer.classList.remove('bluried');
};

const resetGame = () => {
  avatarX = 50;
  avatarY = 50;
  avatarVelocity = 0;
  avatarAceleration = 0.1;
  pipeX = 400;
  pipeY = canvas.height - 200;
  score = 0;
  scoreScreen.innerHTML = score;
};

const endGame = () => {
  endMenu();
};

const setGameTheme = () => {
  lightBtn.addEventListener('click', () => {
    gameContainer.classList.remove('bluried-start');
    document.getElementById('body').classList.remove('start');
    document.getElementById('body').classList.add('light-mode');
    canvas.classList.remove('canvas-start');
    canvas.classList.add('canvas-light');
    document.getElementById('start-menu').style.display = 'none';
    color = '#eabefb ';
    avatar = flappyDay;
    loop();
  });
  darkBtn.addEventListener('click', () => {
    gameContainer.classList.remove('bluried-start');
    document.getElementById('body').classList.remove('start');
    document.getElementById('body').classList.add('dark-mode');
    canvas.classList.remove('canvas-start');
    canvas.classList.add('canvas-dark');
    document.getElementById('start-menu').style.display = 'none';
    color = '#89613a ';
    avatar = flappyNight;
    loop();
  });
};

const loop = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  //Aca seleccionamos la imagen, por lo que deberia de recibirlo desde una prop.

  context.drawImage(avatar, avatarX, avatarY);

  context.fillStyle = color;
  context.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  context.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  if (collisionCheck()) {
    endGame();
    return;
  }

  pipeX -= 1.5;
  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  avatarVelocity += avatarAceleration;
  avatarY += avatarVelocity;

  increaseScore();
  requestAnimationFrame(loop);
};

setGameTheme();
