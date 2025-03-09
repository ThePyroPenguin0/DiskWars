class Menu extends Phaser.Scene {
    preload() {
        this.load.spritesheet('backgroundTiles', 'assets/title_screen.png', {
            frameWidth: 250,
            frameHeight: 300
        });
    }

    constructor() {
        super('menuScene');
    }

    create() {
        this.anims.create({
            key: 'backgroundAnim',
            frames: this.anims.generateFrameNumbers('backgroundTiles', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
        this.background = this.add.sprite(400, 300, 'backgroundTiles');
        this.background.setScale(3.2, 2);
        this.background.play('backgroundAnim');

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('playScene');
        });
    }

    update() {}
}
