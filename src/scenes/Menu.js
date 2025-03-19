class Menu extends Phaser.Scene {
    preload() {
    }
    constructor() {
        super('menuScene');
    }

    create() {
        this.sfxMenu = this.sound.add('sfx-menuMusic')
        this.sfxMenu.setVolume(.5)
        this.sfxMenu.play()
        this.sfxMenu.setLoop(true)
        this.sfxblip = this.sound.add('sfx-blip')
        this.sfxblip.setVolume(.7)
        this.background = this.add.sprite(400, 300, 'backgroundTiles');
        this.background.setScale(3.2, 2);
        this.background.play('backgroundAnim');
        
        this.input.keyboard.on('keydown-ENTER', () => {
            this.sfxblip.play()
            this.sfxMenu.stop()
            this.scene.start('playScene', { scoreBlue: 0, scoreOrange: 0, timeRemaining: 60 });
        });
        this.input.keyboard.on('keydown-C', () => {
            this.sfxblip.play()
            this.sfxMenu.stop()
            this.scene.start('creditsScene')
        })
    }

    update() {}
}
