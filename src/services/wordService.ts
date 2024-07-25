import fs from 'fs';
import path from 'path';
import schedule from 'node-schedule'

export class WordService {
  private selectedWord : string = ''
  private words : string[] = [] 
  private static instance : WordService

  private constructor(){
    this.loadWords()
    this.selectRandomWord()
    this.selectNewRandomWord()
  }

  private loadWords() : void {
    const data: string = fs.readFileSync(path.resolve(__dirname, "../data/en-words.json"), 'utf-8');
    this.words = JSON.parse(data);
  }

  private selectRandomWord(): void {
    if (this.words.length > 0) {
      this.selectedWord = this.words[Math.floor(Math.random() * this.words.length)];
      console.log("New word : " + this.selectedWord)
    }
  }

  private selectNewRandomWord(): void{
    schedule.scheduleJob('0 0 * * *', async () => {
      this.selectRandomWord();
    });
  }

  public static getInstance() : WordService {
    if(!WordService.instance) WordService.instance = new WordService() 
      return WordService.instance
  }

  public getWord() : string{
    return this.selectedWord
  }
}