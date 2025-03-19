class Credits extends Phaser.Scene{
    constructor(){
        super('creditsScene')
    }
    create(){
        this.sfxMenu = this.sound.add('sfx-menuMusic')
        this.sfxMenu.setVolume(.5)
        this.sfxMenu.play()
        this.sfxMenu.setLoop(true)
        this.sfxblip = this.sound.add('sfx-blip')
        this.sfxblip.setVolume(.7)
        // this.background = this.add.tileSprite(0,0,960,875,'credits').setOrigin(0,0)
        // this.background.setScale(3)
        this.creditMenu = this.add.sprite(0,0,'credits').setOrigin(0,0)
        this.creditMenu.setScale(3.2, 2)
        this.input.keyboard.on('keydown-C', () => {
            this.scene.start('menuScene')
            this.sfxblip.play()
            this.sfxMenu.stop()
        })
    }
    update(){
        // do nothing
       
    }
}