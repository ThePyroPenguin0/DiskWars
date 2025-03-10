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

let game = new Phaser.Game(config)
let w = game.config.width
let h = game.config.height
let centerX = game.config.width / 2
let centerY = game.config.height / 2
