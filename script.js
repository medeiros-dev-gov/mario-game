const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const bgMusic = document.getElementById('bg-music');
const gameOverMusic = document.getElementById('game-over-music');
const jumpSound = document.getElementById('jump-sound');
const btnReturn = document.querySelector('.btn-return');
const gameOverMsg = document.querySelector('.game-over-msg');
const scoreElement = document.getElementById('pontuacao');


const isMobile = window.innerWidth <= 600;
let pipeSpeed = isMobile ? 7.0 : 9;  // mobile um pouco mais rápido que antes
const pipeSpeedMax = 14;

let jogoAtivo = true;
let pontuacao = 0;
let pipeX = window.innerWidth;
const pipeWidth = 80;
let animationFrameId;
let musicStarted = false;

// Iniciar música ao interagir
function iniciarMusica() {
  if (!musicStarted) {
    bgMusic.play();
    musicStarted = true;
  }
}
document.addEventListener('click', iniciarMusica);
document.addEventListener('keypress', iniciarMusica);

function jump() {
  if (!jogoAtivo) return;

  mario.classList.remove('jump');
  void mario.offsetWidth;
  mario.classList.add('jump');
  jumpSound.currentTime = 0;
  jumpSound.play();
}

function aumentarPontuacao() {
  if (!jogoAtivo) return;
  pontuacao += 10;
  scoreElement.textContent = pontuacao;

  if (pontuacao % 20 === 0 && pipeSpeed < pipeSpeedMax) {
    pipeSpeed += 1;
  }
}

function detectarColisao(pipeX, marioBottom) {
  const marioLeft = 100;      // posição horizontal do Mario
  const marioWidth = 50;      // largura real do Mario

  const pipeLeft = pipeX;
  const pipeRight = pipeX + pipeWidth;

  const colisaoHorizontal = pipeLeft < (marioLeft + marioWidth) && pipeRight > marioLeft;
  const colisaoVertical = marioBottom < 80;

  return colisaoHorizontal && colisaoVertical;
}

function atualizar() {
  if (!jogoAtivo) return;

  pipeX -= pipeSpeed;

  if (pipeX + pipeWidth <= 0) {
    pipeX = window.innerWidth;
    aumentarPontuacao();
  }
  pipe.style.left = `${pipeX}px`;

  const marioBottom = parseInt(window.getComputedStyle(mario).bottom);

  if (detectarColisao(pipeX, marioBottom)) {
    fecharJogo();
    return;
  }

  animationFrameId = requestAnimationFrame(atualizar);
}

function fecharJogo() {
  jogoAtivo = false;
  cancelAnimationFrame(animationFrameId);

  mario.src = 'mario-jump-images/game-over.png';
  mario.style.width = '75px';
  mario.style.marginLeft = '50px';

  gameOverMsg.style.display = 'block';
  btnReturn.style.display = 'block';

  bgMusic.pause();
  bgMusic.currentTime = 0;
  gameOverMusic.play();
}

btnReturn.onclick = () => location.reload();

document.addEventListener('click', jump);
document.addEventListener('touchstart', jump);
document.addEventListener('keypress', jump);

function iniciarJogo() {
  pipe.style.animation = 'none';
  pipe.style.right = 'auto'; // importante para controle manual
  atualizar();
}

iniciarJogo();

// Reseta música ao recarregar
window.onbeforeunload = () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
};
