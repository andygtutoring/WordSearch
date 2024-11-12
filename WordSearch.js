// WordSearch.js
// IndexedDB setup
const dbVersion = 1;
const dbName = 'word-search-game';
let db;

// Open IndexedDB connection
const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('progress', { keyPath: 'id' });
      db.createObjectStore('wordLists', { keyPath: 'id' });
      db.createObjectStore('gameSettings', { keyPath: 'id' });
    };
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };
    request.onerror = () => {
      reject('Error opening database');
    };
  });
};

// WordSearchGame class
class WordSearchGame {
  constructor(canvas, wordListElement) {
    this.canvas = canvas;
    this.wordListElement = wordListElement;
    this.ctx = canvas.getContext('2d');
    this.words = [];
    this.difficultyLevel = 'easy';
    this.progress = {};
  }

  async init() {
    await openDB();
    this.loadProgress();
    this.loadWordList();
    this.drawGameBoard();
  }

  loadProgress() {
    const transaction = db.transaction('progress', 'readonly');
    const objectStore = transaction.objectStore('progress');
    const request = objectStore.get(1);
    request.onsuccess = () => {
      this.progress = request.result || {};
    };
  }

  saveProgress() {
    const transaction = db.transaction('progress', 'readwrite');
    const objectStore = transaction.objectStore('progress');
    objectStore.put(this.progress, 1);
  }

  loadWordList() {
    const transaction = db.transaction('wordLists', 'readonly');
    const objectStore = transaction.objectStore('wordLists');
    const request = objectStore.get(1);
    request.onsuccess = () => {
      this.words = request.result.words;
      this.drawWordList();
    };
  }

  drawGameBoard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw game board logic
  }

  drawWordList() {
    this.wordListElement.innerHTML = '';
    this.words.forEach((word) => {
      const wordElement = document.createElement('div');
      wordElement.textContent = word;
      this.wordListElement.appendChild(wordElement);
    });
  }
}

// Initialize game
const gameCanvas = document.getElementById('game-canvas');
const wordListElement = document.getElementById('word-list');
const newGameBtn = document.getElementById('new-game-btn');
const saveProgressBtn = document.getElementById('save-progress-btn');

const game = new WordSearchGame(gameCanvas, wordListElement);

newGameBtn.addEventListener('click', () => {
  game.init();
});

saveProgressBtn.addEventListener('click', () => {
  game.saveProgress();
});

game.init();

