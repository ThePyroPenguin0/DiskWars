'use strict'
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // centers screen
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Load, Menu, Play]

}

const game = new Phaser.Game(config)
const w = game.config.width
const h = game.config.height
const centerX = game.config.width / 2
const centerY = game.config.height / 2
