let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Play],
}

const game = new Phaser.Game(config)

// globals
const centerX = game.config.width / 2
const centerY = game.config.height / 2