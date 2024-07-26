const emojis = require("../data/emojis.json")

export class MotdleGame{
    private wordToFind : string
    private history : string[]
    private tries : number
    private maxTries : number
    private startingTime : number
    private discordId : string
    private serverId : string | null

    public constructor(wordToFind : string, discordId : string, serverId : string | null, maxTries : number){
        this.wordToFind = wordToFind
        this.discordId = discordId
        this.serverId = serverId
        this.startingTime = Date.now()
        this.maxTries = maxTries
        this.tries = 0
        this.history = []
    }

    private getLettersDetails() : {[key : string] : number} {
        let details : {[key : string] : number} = {}
        for(let letter of this.wordToFind){
            if(!(letter in details)) details[letter] = 1
            else details[letter]++
        }
        return details
    }

    public getLetters(word : string) : string{
        let details : {[key : string] : number} = this.getLettersDetails()
        let letters : string[] = new Array<string>(this.wordToFind.length)
        let i : number = 0

        for(i; i < word.length; i++){
            let letter : string = word[i]
            if(letter == this.wordToFind[i]) {
                letters[i] = `<:${letter}_green:${emojis[letter].green}>`
                details[letter]--
            } 
        }

        for(i = 0; i < word.length; i++){
            let letter : string = word[i]
            if(letters[i] != undefined) {
                continue
            }
            if(!this.wordToFind.includes(letter)) {
                letters[i] = `<:${letter}_grey:${emojis[letter].grey}>`
                continue
            }
            if(details[letter] <= 0)  {
                letters[i] = `<:${letter}_grey:${emojis[letter].grey}>`
                continue
            }
            letters[i] = `<:${letter}_yellow:${emojis[letter].yellow}>`
            details[letter]--
        }

        return letters.join("")
    }

    public getHistoryLetters() : string[]{
        let history : string[] = []
        for(let word of this.history) history.push(this.getLetters(word))
        return history
    }

    public addToHistory(word : string) : string[]{
        this.history.push(word)
        return this.history
    }

    public getMaxTries() : number{
        return this.maxTries
    }

    public getTries() : number{
        return this.tries
    }

    public win(){

    }

    public lose(){

    }
}