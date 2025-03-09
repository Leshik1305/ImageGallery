//Вводим переменные:
let data = [];
let timerId;
let time = 100;
let currentIndex = 0;
let loadingCount = 4;

//Функция, отвечающая за обновление таймера:
function updateTimer() {
  time -= 0.3; // уменьшение таймера
  if (time <= 0) {
    //когда время таймера заканчивается, выбирается следующее изображение,
    selectImage(currentIndex + 1);
    time = 100;
  }
  document.querySelector(".bar").style.width = time + "%";
  startTimer();
}

//Функция, которая меняет активность таймера:
function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}

//Функция, которая останавливает таймер:
function stopTimer() {
  time = 100;
  document.querySelector(".bar").style.width = time + "%";
  clearTimeout(timerId);
}

//Функция, которая запускает таймер:
function startTimer() {
  timerId = setTimeout(updateTimer, 15);
}

//Функция, которая выбирает изображение в зависимости от индекса:
function selectImage(index) {
  currentIndex = Number(index);
  if (currentIndex === data.length) {
    loadImages();
  }
  document.querySelectorAll(".thumb div").forEach((item, i) => {
    if (i === currentIndex) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
  document.querySelector(".preview img").src = data[currentIndex].download_url;
  document.querySelector(".preview img").classList.add("loading");
  document.querySelector(".preview .author").textContent =
    data[currentIndex].author;
}

//Функция, которая отвечает за загрузку новых изображений
function drawImages() {
  const images = document.querySelectorAll(".thumb img");
  data.forEach((item, i) => {
    images[i].src = item.download_url;
    images[i].classList.add("loading");
  });
  selectImage(0);
}

//Функция, отвечающая за данные новых загружаемых изображений
function loadImages() {
  loadingCount = 4;
  stopTimer();
  const page = Math.floor(Math.random() * (800 / 4));
  const url = "https://picsum.photos/v2/list?page=" + page + "&limit=4";
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data = json;
      drawImages();
    });
}

//Функция,  останавливающая таймер при нажатии на изображение
function onThumbClick(event) {
  if (event.target.tagName !== "IMG") return;
  stopTimer();
  document.querySelector(".play").textContent = "PLAY";
  selectImage(event.target.dataset.index);
}

//Функция, обновляющая изображения на странице
function removeLoading(event) {
  loadingCount -= 1;
  if (
    loadingCount === 0 &&
    document.querySelector(".play").textContent === "STOP"
  ) {
    startTimer();
  }
  event.target.classList.remove("loading");
}

//Эта функция, позволяющая  вынести в html-файле ссылку на js-файл в header и вызвать все обработчики событий перед загрузкой всего DOM-дерева:
function init() {
  loadImages();
  document.querySelector(".thumb").addEventListener("click", onThumbClick);
  document.querySelector(".new").addEventListener("click", loadImages);
  document.querySelectorAll("img").forEach((item) => {
    item.onload = removeLoading;
  });
  document.querySelector(".play").addEventListener("click", toggleTimer);
}
window.addEventListener("DOMContentLoaded", init);
