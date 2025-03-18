class Menu extends Phaser.Scene {
    preload() {
    }
    constructor() {
        super('menuScene');
    }

    create() {
        this.background = this.add.sprite(400, 300, 'backgroundTiles');
        this.background.setScale(3.2, 2);
        this.background.play('backgroundAnim');
        
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('playScene', { scoreBlue: 0, scoreOrange: 0, timeRemaining: 60 });
        });
    }

    update() {}
}
