import fs from 'fs';
import path from 'path';

export let words: string[] = [];
let selectedWord: string = '';

export function loadWords(): void {
  const data: string = fs.readFileSync(path.resolve(__dirname, "../data/en-words.json"), 'utf-8');
  words = JSON.parse(data);
}

export function selectRandomWord(): void {
  if (words.length > 0) {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    console.log("New word : " + selectedWord)
  }
}