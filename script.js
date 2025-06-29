// 🎮 Elementos do DOM
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const bgMusic = document.getElementById('bg-music');
const gameOverMusic = document.getElementById('game-over-music');
const jumpSound = document.getElementById('jump-sound');
const btnReturn = document.querySelector('.btn-return');
const gameOverMsg = document.querySelector('.game-over-msg');
const scoreElement = document.getElementById('pontuacao');
const startScreen = document.getElementById('start-screen');
const btnStart = document.getElementById('btn-start');
const moedasElement = document.getElementById('moedas');
const tempoElement = document.getElementById('tempo');

// 📱 Verifica se está no mobile
const isMobile = window.innerWidth <= 600;

// ⚙️ Variáveis globais
let pipeSpeed = isMobile ? 7.0 : 9;
const pipeSpeedMax = 14;
let pipeX = window.innerWidth;
const pipeWidth = 80;
let jogoAtivo = false;
let pontuacao = 0;
let animationFrameId;
let musicStarted = false;
let tempo = 0;
let intervaloTempo;
let moedas = []; // Moedas dinâmicas na tela

// 🔊 Inicia música ao interagir
function iniciarMusica() {
  if (!musicStarted) {
    bgMusic.play();
    musicStarted = true;
  }
}
document.addEventListener('click', iniciarMusica);
document.addEventListener('keypress', iniciarMusica);

// 🪙 Gera entre 3 e 5 moedas em posições aleatórias
function gerarMoedas() {
  const quantidade = Math.floor(Math.random() * 3) + 3; // 3 a 5

  for (let i = 0; i < quantidade; i++) {
    const novaMoeda = document.createElement('img');
    novaMoeda.src = 'gif/coin.gif';
    novaMoeda.classList.add('coin');

    const distancia = 500 + Math.random() * 1500;
    const altura = 120 + Math.random() * 100;

    novaMoeda.style.left = `${window.innerWidth + distancia}px`;
    novaMoeda.style.bottom = `${altura}px`;

    document.querySelector('.game-board').appendChild(novaMoeda);
    moedas.push(novaMoeda);
  }
}

// 🕹️ Iniciar jogo
function iniciarJogo() {
  startScreen.style.display = 'none';
  jogoAtivo = true;
  pipe.style.animation = 'none';
  pipe.style.right = 'auto';

  pipeX = window.innerWidth + (isMobile ? 150 : 0);

  tempo = 0;
  tempoElement.textContent = '0s';
  intervaloTempo = setInterval(() => {
    tempo++;
    tempoElement.textContent = `${tempo}s`;
  }, 1000);

  atualizar();
}

btnStart.addEventListener('click', () => {
  iniciarMusica();
  iniciarJogo();
});

// 🎯 Pulo
function jump() {
  if (!jogoAtivo) return;

  mario.classList.remove('jump');
  void mario.offsetWidth;
  mario.classList.add('jump');

  jumpSound.currentTime = 0;
  jumpSound.play();
}
document.addEventListener('click', jump);
document.addEventListener('touchstart', jump);
document.addEventListener('keypress', jump);

// 🧮 Atualizar pontuação
function aumentarPontuacao() {
  if (!jogoAtivo) return;

  pontuacao += 10;
  scoreElement.textContent = pontuacao;

  // Aumenta a velocidade a cada 150 pontos
  if (pontuacao % 150 === 0 && pipeSpeed < pipeSpeedMax) {
    pipeSpeed += 1;
  }
}

// 💥 Detectar colisão Mario x Pipe
function detectarColisao(pipeX, marioBottom) {
  const marioLeft = 100;
  const marioWidth = 50;

  const pipeLeft = pipeX;
  const pipeRight = pipeX + pipeWidth;

  const colisaoHorizontal = pipeLeft < (marioLeft + marioWidth) && pipeRight > marioLeft;
  const colisaoVertical = marioBottom < 80;

  return colisaoHorizontal && colisaoVertical;
}

// 🔁 Loop do jogo
function atualizar() {
  if (!jogoAtivo) return;

  pipeX -= pipeSpeed;

  if (pipeX + pipeWidth <= 0) {
    pipeX = window.innerWidth;
    aumentarPontuacao();
    gerarMoedas();
  }

  pipe.style.left = `${pipeX}px`;

  const marioBottom = parseInt(window.getComputedStyle(mario).bottom);

  // 🎯 Colisão com pipe
  if (detectarColisao(pipeX, marioBottom)) {
    fecharJogo();
    return;
  }

  // 💰 Colisão com moedas
  moedas.forEach((moeda, index) => {
    const moedaLeft = moeda.offsetLeft;
    moeda.style.left = `${moedaLeft - pipeSpeed}px`;

    const marioLeft = mario.offsetLeft;
    const marioRight = marioLeft + mario.offsetWidth;

    const moedaRight = moedaLeft + moeda.offsetWidth;
    const moedaBottom = parseInt(window.getComputedStyle(moeda).bottom);
    const moedaTop = moedaBottom + moeda.offsetHeight;

    const marioTop = marioBottom + mario.offsetHeight;

    const colisaoH = marioRight > moedaLeft && marioLeft < moedaRight;
    const colisaoV = marioTop > moedaBottom && marioBottom < moedaTop;


    if (colisaoH && colisaoV) {
      pontuacao += 5;
      scoreElement.textContent = pontuacao;

      const totalMoedas = parseInt(moedasElement.textContent) || 0;
      moedasElement.textContent = totalMoedas + 1;

      moeda.remove();
      moedas.splice(index, 1);
    } else if (moedaLeft + moeda.offsetWidth < 0) {
      moeda.remove();
      moedas.splice(index, 1);
    }
  });

  animationFrameId = requestAnimationFrame(atualizar);
}

// ☠️ Fim do jogo
function fecharJogo() {
  jogoAtivo = false;
  cancelAnimationFrame(animationFrameId);

  mario.src = 'img/game-over.png';
  mario.style.width = '75px';
  mario.style.marginLeft = '50px';

  gameOverMsg.style.display = 'block';
  btnReturn.style.display = 'block';

  bgMusic.pause();
  bgMusic.currentTime = 0;
  gameOverMusic.play();

  clearInterval(intervaloTempo);
}

// 🔁 Reiniciar
btnReturn.onclick = () => location.reload();

// ⏹️ Ao sair da página
window.onbeforeunload = () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
};
