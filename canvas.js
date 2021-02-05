const canvas = document.querySelector("#bg-canvas");
const acanvas = document.querySelector("#api-canvas");
const context = canvas.getContext("2d");
const cxt = acanvas.getContext("2d");
const layer = document.querySelector("#layer-canvas");
const layer2 = document.querySelector("#layer-canvas2");
const particle = document.querySelector("#particle-canvas");
const pxt = particle.getContext("2d");
let stars = [];
let drops = [];

layer.style.opacity = "0";
layer2.style.opacity = "0";
particle.style.opacity = "1";

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  layer.width = window.innerWidth;
  layer.height = window.innerHeight;
  layer2.width = window.innerWidth;
  layer2.height = window.innerHeight;
  acanvas.width = window.innerWidth;
  acanvas.height = window.innerHeight;
  particle.width = window.innerWidth;
  particle.height = window.innerHeight;

  for (let i = 0; i < 200; ++i) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random(),
      change: 0.15,
      ochange: 0.1,
      opacity: 0
    });

    drops.push({
      x: Math.random(),
      y: Math.random(),
      size: 0.4,
      change: 0.15
    });
  }
}

function update() {
  for (let star of stars) {
    star.x += 0.001;
    if (star.x > 1.0) {
      star.x = 0.0;
    }

    if (star.size < 0.1) {
      star.ochange = -0.3;
      star.change = 0.1;
    } else if (star.size > 0.9) {
      star.ochange = 0.3;
      star.change = -0.1;
    }
    star.size += star.change;
    star.opacity += star.ochange;
  }
}

function updateSec() {
  for (let drop of drops) {
      //console.log(drop.y);
    drop.y -= 0.002;
    if (drop.y < 0.0) {
      drop.y = 1.0;
    }
  }

 
}

function render() {
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  for (let star of stars) {
    context.beginPath();
    context.arc(
      star.x * width,
      star.y * height,
      star.size * 3,
      0,
      2 * Math.PI,
      false
    );
    context.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    context.fill();
  }
}

function renderSec() {
  const { width, height } = acanvas;
  context.clearRect(0, 0, width, height);
  for (let drop of drops) {
    context.beginPath();
    context.arc(
      drop.x * width,
      drop.y * height,
      drop.size * 3,
      0,
      2 * Math.PI,
      false
    );
    context.fillStyle = "white";
    context.fill();
  }
}


function renderParticle() {

    const { width, height } = acanvas;
    pxt.clearRect(0, 0, width, height);
    for(let star of stars){
        pxt.beginPath();
        pxt.arc(
            star.x * width,
      star.y * height,
      star.size * 2,
      0,
      2 * Math.PI,
      false 
        );
        pxt.fillStyle = "rgba(200, 220, 255, 0.4)";
        pxt.fill();
    }
}

function onChangeSec() {
  updateSec();
  renderSec();
  renderParticle();
}

function onChange() {
  update();
  render();
}

function fetchData() {
  const link = `https://api.hangang.msub.kr/`;

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let dataArr = [];


  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        dataArr.push(data.temp, data.time, data.station);

        cxt.font = "1.7em Noto Serif KR";
        cxt.textAlign = "center";
        cxt.fillStyle = "#fff";
        cxt.fillText("지금 한강은...", acanvas.width / 2, acanvas.height / 4);

        cxt.font = "bold 9.7em Heebo";
        cxt.fillStyle = "#fff";
        cxt.fillText(
          `${dataArr[0]}°`,
          acanvas.width / 1.96,
          acanvas.height / 2
        );

        let t = date.getHours();

        if (t > 17) {
          layer.style.opacity = "0.5";
          layer2.style.opacity = "0";
          setInterval(onChange, 100);
        } else {
          layer2.style.opacity = "0.7";
          layer.style.opacity = "0";
          setInterval(onChangeSec, 100);
        }

        cxt.font = "1.2em Noto Serif KR";
        cxt.fillStyle = "#fff";
        cxt.fillText(
          `${dataArr[2]} | ${year}년 ${month + 1}월 ${day}일 ${
            dataArr[1]
          } 측정   `,
          acanvas.width / 1.98,
          acanvas.height / 1.6
        );

        cxt.font = "0.9em Heebo";
        cxt.fillStyle = "rgba(255, 255, 255, 0.8)";
        cxt.fillText(
          "made with MSUB API 💧",
          acanvas.width / 2,
          acanvas.height / 1.05
        );
      } else {
        cxt.font = "bold 3em Heebo";
        cxt.textAlign = "center";
        cxt.fillStyle = "#fff";
        cxt.fillText(
          `⚠ 데이터를 가져올 수 없습니다.`,
          acanvas.width / 2,
          acanvas.height / 2
        );
      }
      console.log(dataArr);
    });
}

init();
fetchData();
