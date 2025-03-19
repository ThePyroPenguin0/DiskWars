class Winner extends Phaser.Scene {
   
    init(data) {
        this.scoreBlue = data.scoreBlue ;
        this.scoreOrange = data.scoreOrange ;
        this.winner = "none"
        console.log(`Blue score: ${this.scoreBlue}, Orange score: ${this.scoreOrange}`);
    }
    constructor(){
        super('winnerScene') 
    }
    create(){
        this.sfxblip = this.sound.add('sfx-blip')
        this.sfxblip.setVolume(.7)
        this.sfxWin = this.sound.add('sfx-win')
        this.sfxWin.setVolume(.5)
        this.sfxTie = this.sound.add('sfx-tied')
        this.sfxTie.setVolume(.5)
        if(this.scoreBlue > this.scoreOrange)
        {
            this.sfxWin.play()
            console.log('blue won')
            this.blueWin = this.add.sprite(0,0,'p1_win').setOrigin(0,0)
            this.blueWin.setScale(3.2, 2)
        }
        else if(this.scoreOrange > this.scoreBlue)
        {
            this.sfxWin.play()
            console.log('orange won')
            this.orangeWin = this.add.sprite(0,0,'p2_win').setOrigin(0,0)
            this.orangeWin.setScale(3.2, 2)
        }
        else{
            this.sfxTie.play()
            this.tiedGame = this.add.sprite(0,0,'tied').setOrigin(0,0)
            this.tiedGame.setScale(3.2, 2)
        }
        this.input.keyboard.on('keydown-M', () => {
            this.sfxblip.play()
            this.scene.start('menuScene')
        })
        this.input.keyboard.on('keydown-ENTER', () => {
            this.sfxblip.play()
            this.scene.start('playScene', { scoreBlue: 0, scoreOrange: 0, timeRemaining: 60 });
        });
        this.input.keyboard.on('keydown-C', () => {
            this.sfxblip.play()
            this.scene.start('creditsScene')
        });
        
        
        
    }
    update(){
    
    }
}