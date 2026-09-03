const canvas = document.querySelector("#ascii-background");
const context = canvas.getContext("2d");

const characters = "01@#$%&*+=-:.";
const fontSize = 12;
const framesPerSecond = 2;

let columns;
let rows;

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * pixelRatio;
  canvas.height = rect.height * pixelRatio;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  columns = Math.ceil(rect.width / fontSize);
  rows = Math.ceil(rect.height / fontSize);
}

function getRandomCharacter() {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

function drawAsciiBackground() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  context.clearRect(0, 0, width, height);

  context.font = `${fontSize}px monospace`;
  context.fillStyle = "#d8fb81";
  context.textBaseline = "top";

  for (let row = 0; row < rows; row++) {
    let line = "";

    for (let column = 0; column < columns; column++) {
      // Nogle felter efterlades tomme
      line += Math.random() > 0.25 ? getRandomCharacter() : " ";
    }

    context.fillText(line, 0, row * fontSize);
  }
}

resizeCanvas();
drawAsciiBackground();

const animation = setInterval(drawAsciiBackground, 1000 / framesPerSecond);

window.addEventListener("resize", () => {
  resizeCanvas();
  drawAsciiBackground();
});