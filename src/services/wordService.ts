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
    this.scheduleWordSelection()
  }

  private loadWords() : void {
    try{
      const data: string = fs.readFileSync(path.resolve(__dirname, "../data/en-words.json"), 'utf-8');
      this.words = JSON.parse(data);
    } catch(e){
      console.error('Error loading words : ', e)
    }
  }

  private selectRandomWord(): void {
    if (this.words.length > 0) {
      this.selectedWord = this.words[Math.floor(Math.random() * this.words.length)];
      console.log("New word : " + this.selectedWord)
    }
  }

  private scheduleWordSelection(): void{
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