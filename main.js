'use strict';

const container = document.querySelector('.image-container');
const startButton = document.querySelector('.start-button');
const gameText = document.querySelector('.game-text');
const playTIme = document.querySelector('.play-time');
const tiles = document.querySelectorAll('.image-container > li');

const dragged = {
  el: null,
  class: null,
  index: null,
}

startButton.addEventListener('click', (e) => {
  setGame();
});

let isPlaying = false;
let timeInterval = null;
let time = 0;

function setGame() {
  time = 0;
  gameText.style.display = 'none';
  timeInterval = setInterval(() => {
    time++;
    playTIme.textContent = time;
  }, 1000);

  const gameTiles = shuffle([...tiles]);
  container.innerHTML = '';
  gameTiles.forEach(tile => {
    container.appendChild(tile);
  });
}

function shuffle(array) {
  let index = array.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
}

function checkStatus() {
  const currentList = [...container.children];
  const unMatched = currentList.filter((list, index) => {
    return Number(list.getAttribute('data-type')) !== index
  });
  if(unMatched.length === 0) {
    isPlaying = false;
    clearInterval(timeInterval);
    gameText.style.display = 'block';
  }
}

container.addEventListener('dragstart', (e) => {
  const obj = e.target;
  // console.log({obj});
  dragged.el = obj;
  dragged.class = obj.className;
  dragged.index = [...obj.parentNode.children].indexOf(obj);
  // console.log(e);
});
container.addEventListener('dragover', (e) => {
  e.preventDefault();
  // console.log(e)
});
container.addEventListener('drop', (e) => {
  // console.log(e.target);
  const obj = e.target;
  let originPlace;
  let isLast = false;
  if (dragged.el.nextSibling) {
    originPlace = dragged.el.nextSibling;
  } else {
    originPlace = dragged.el.previousSibling;
    isLast = true;
  }
  const droppedIndex = [...obj.parentNode.children].indexOf(obj);
  dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
  isLast ? originPlace.after(obj) : originPlace.before(obj);
  checkStatus();
});