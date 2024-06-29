const topLeftDiv = document.querySelector(".left-side");
let canvas = document.getElementById("canvas");
const spinBtn = document.querySelector(".spin-btn");

const textAreaDiv = document.querySelector(".textarea-div");
const textArea = document.querySelector("#data-input");

const winnerBtnContainer = document.querySelector(".winner-btn-container");
const winnerBtnClose = document.querySelector("#close-btn");
const winnerBtnText = document.querySelector(".winner-btn-text");

let wheel;
let names = ["Mahmudullah", "Rahim", "Tamim", "Mustafizur", "Sakib"];
const segColors = ["#EE4040", "#815CD1", "#F0CF50", "#3DA5E0", "#FF9000"];
let wheelCenter;
let wheelSize;
let spinBtnMargin = 50;

const initialValues = () => {
  let str = "";
  names.map((name) => {
    str += name + "\n";
  });
  return str;
};

textArea.value = initialValues();

const makeWheel = () => {
  wheel = new Wheel(
    canvas,
    names,
    segColors,
    "white", // primary color
    "white", // contrast color
    wheelSize, // wheel size
    wheelCenter.x, // wheel centerX
    wheelCenter.y, // wheel centerY
    45, // applied force
    1.2 // friction
  );

  wheel.draw();
};

const initialSetup = () => {
  const container = topLeftDiv.getBoundingClientRect();
  canvas.width = container.width;
  canvas.height = window.innerHeight;

  if (canvas.width < canvas.height) {
    wheelSize = (canvas.width - 100) / 2 > 200 ? 200 : (canvas.width - 100) / 2;
  } else {
    wheelSize =
      (canvas.height - 100) / 2 > 200 ? 200 : (canvas.height - 100) / 2;
  }

  wheelCenter = {
    x: canvas.width / 2,
    y: canvas.height / 2 - spinBtnMargin,
  };

  const spinBtnInfo = spinBtn.getBoundingClientRect();

  spinBtn.style.top = `${wheelCenter.y + wheelSize + 50}px`;
  spinBtn.style.left = `${wheelCenter.x - spinBtnInfo.width / 2}px`;

  makeWheel();
};

initialSetup();

textAreaDiv.style.marginTop = `${
  window.innerWidth > 768 && canvas.height / 5
}px`;

textArea.addEventListener("input", (e) => {
  const value = e.target.value;
  names = value.trim().split("\n");
  names = names.filter((name) => name !== "");
  makeWheel();
});

spinBtn.onclick = () => {
  winnerBtnContainer.style.display = "none";
  spinBtn.disabled = true;
  wheel.spin().then((res) => {
    winnerBtnContainer.style.display = "block";
    winnerBtnText.textContent = `"${res}" is winner!`;
    const winnerBtnInfo = winnerBtnContainer.getBoundingClientRect();
    // curve
    if (window.innerWidth > 768)
      wheel.drawCurve(winnerBtnInfo.x + 20, winnerBtnInfo.y - 10);
    spinBtn.disabled = false;
  });
};

winnerBtnClose.onclick = () => {
  winnerBtnContainer.style.display = "none";
  wheel.draw();
};
