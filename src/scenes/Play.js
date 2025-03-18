class Play extends Phaser.Scene {
    init(data) {
        this.scoreBlue = data.scoreBlue || 0;
        this.scoreOrange = data.scoreOrange || 0;
        this.timeRemaining = data.timeRemaining || 60;
        console.log(`Blue score: ${this.scoreBlue}, Orange score: ${this.scoreOrange}`);
    }

    preload() {
        this.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
    }

    constructor() {
        super('playScene');
    }

    create() {
        this.sfxBackground = this.sound.add('sfx-background')
        this.sfxBackground.setLoop(true)
        this.sfxBackground.setVolume(.25)
        this.sfxBackground.play()
        this.sfxDeathBoom = this.sound.add('sfx-deathBoom')
        this.sfxDeathBoom.setVolume(0.7)
        this.blueDiskThrown = false;
        this.orangeDiskThrown = false;
        // You don't see the entire board on screen in game? I have some bad news for you...
        let staggeraxis = 'x';
        let staggerindex = 'odd';

        let boardBlue = this.rexBoard.add.board({
            grid: {
                gridType: 'hexagonGrid',
                x: -300,
                y: 175,
                cellHeight: 20,
                cellWidth: 40,
                staggeraxis: staggeraxis,
                staggerindex: staggerindex
            }
        });

        let boardOrange = this.rexBoard.add.board({
            grid: {
                gridType: 'hexagonGrid',
                x: 200,
                y: -225,
                cellHeight: 20,
                cellWidth: 40,
                staggeraxis: staggeraxis,
                staggerindex: staggerindex
            }
        });

        this.blueTilesGroup = this.physics.add.group({
            immovable: true,
            classType: Phaser.Physics.Arcade.Sprite
        });

        this.orangeTilesGroup = this.physics.add.group({
            immovable: true,
            classType: Phaser.Physics.Arcade.Sprite
        });

        let tileXYArray = boardBlue.fit(this.rexBoard.hexagonMap.parallelogram(boardBlue, 0, 15, 30));
        let tileXYArray2 = boardOrange.fit(this.rexBoard.hexagonMap.parallelogram(boardOrange, 0, 15, 30));

        boardBlue.validTiles = [];
        boardOrange.validTiles = [];

        let tileXY;
        for (let i in tileXYArray) {
            tileXY = tileXYArray[i];
            boardBlue.validTiles.push(tileXY);
        }

        for (let i in tileXYArray2) {
            tileXY = tileXYArray2[i];
            boardOrange.validTiles.push(tileXY);
        }

        // Add tiles to the blueTilesGroup
        for (let tileXY of tileXYArray) {
            let worldXY = boardBlue.tileXYToWorldXY(tileXY.x, tileXY.y);
            let tileSprite = this.blueTilesGroup.create(worldXY.x, worldXY.y, 'hexBlue');  // Add to blueTilesGroup
            tileSprite.setScale(0.5, 0.25).setOrigin(0.5);
            tileSprite.body.setCircle(16)
            tileSprite.body.setOffset(9, -9)
        }

        // Add tiles to the orangeTilesGroup
        for (let tileXY of tileXYArray2) {
            let worldXY = boardOrange.tileXYToWorldXY(tileXY.x, tileXY.y);
            let tileSprite = this.orangeTilesGroup.create(worldXY.x, worldXY.y, 'hexOrange');  // Add to orangeTilesGroup
            tileSprite.setScale(0.5, 0.25).setOrigin(0.5);
            tileSprite.body.setCircle(16)
            tileSprite.body.setOffset(9, -9)
        }

        this.playerBlue = new Player(this, boardBlue, 8, 27, 'b_stand', 0x0000FF);
        this.playerOrange = new Player(this, boardOrange, 13, 19, 'o_stand', 0xFFA500);
        this.blueDisksGroup = this.add.group();
        this.orangeDisksGroup = this.add.group();

        this.timerText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `Time Remaining: ${this.timeRemaining}\nScore: ${this.scoreBlue}-${this.scoreOrange}`, {
            fontSize: '32px',
            fontFamily: '"Orbitron", sans-serif',
            align: 'center',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);
        this.timerText.setAngle(37.5);
    
        // Start the timer
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        //makes scale larger 
        this.playerBlue.setScale(2.5)
        this.playerOrange.setScale(2.5)
        this.input.keyboard.on('keydown-D', () => { // Decided to have hexes but only four movement directions. It actually works surprisingly well.
            if (this.playerBlue.mode == "move") {
                this.playerBlue.moveDirection(0)
                this.playerBlue.anims.play('B_E_Walk_Animation', true)
            }
            else { this.playerBlue.changeDiskAngle("d"); }
        });
        this.input.keyboard.on('keyup-D', () => {
            {
                this.playerBlue.anims.stop()
                this.playerBlue.setTexture('b_stand')
            }
        });
        this.input.keyboard.on('keydown-W', () => {
            if (this.playerBlue.mode == "move") {
                this.playerBlue.moveDirection(2)
                this.playerBlue.anims.play('B_NW_Walk_Animation', true)
            }
        });
        this.input.keyboard.on('keyup-W', () => {
            {
                this.playerBlue.anims.stop()
                this.playerBlue.setTexture('b_stand')
            }
        });
        this.input.keyboard.on('keydown-A', () => {
            if (this.playerBlue.mode == "move") {
                this.playerBlue.moveDirection(3)
                this.playerBlue.anims.play('B_W_Walk_Animation', true)
            }
            else { this.playerBlue.changeDiskAngle("a"); }
        });
        this.input.keyboard.on('keyup-A', () => {
            {
                this.playerBlue.anims.stop()
                this.playerBlue.setTexture('b_stand')
            }
        });
        this.input.keyboard.on('keydown-S', () => {
            if (this.playerBlue.mode == "move") {
                this.playerBlue.moveDirection(4)
                this.playerBlue.anims.play("B_SE_Walk_Animation", true)
            }
        });
        this.input.keyboard.on('keyup-S', () => {
            {
                this.playerBlue.anims.stop()
                this.playerBlue.setTexture('b_stand')
            }
        });
        this.input.keyboard.on('keydown-E', () => {
            if (this.playerBlue.mode == "move") {
                this.playerBlue.toggleMode();
            }
            else {
                this.playerBlue.throwDiskFromPlayer();
                this.playerBlue.deleteLine();
            }
        });
        this.input.keyboard.on('keydown-X', () => {
            this.playerBlue.deleteLine();
            this.playerBlue.throwDiskFromPlayer();

        });

        this.input.keyboard.on('keydown-L', () => {
            if (this.playerOrange.mode == "move") {
                this.playerOrange.moveDirection(0)
                this.playerOrange.anims.play('O_E_Walk_Animation')
            }
            else { this.playerOrange.changeDiskAngle("d"); }
        });
        this.input.keyboard.on('keyup-L', () => {
            {
                this.playerOrange.anims.stop()
                this.playerOrange.setTexture('o_stand')
            }
        });
        this.input.keyboard.on('keydown-I', () => {
            if (this.playerOrange.mode == "move") {
                this.playerOrange.moveDirection(2)
                this.playerOrange.anims.play('O_NW_Walk_Animation', true)
            }
        });
        this.input.keyboard.on('keyup-I', () => {
            {
                this.playerOrange.anims.stop()
                this.playerOrange.setTexture('o_stand')
            }
        });
        this.input.keyboard.on('keydown-J', () => {
            if (this.playerOrange.mode == "move") {
                this.playerOrange.moveDirection(3)
                this.playerOrange.anims.play('O_W_Walk_Animation')
            }
            else { this.playerOrange.changeDiskAngle("a"); }
        });
        this.input.keyboard.on('keyup-J', () => {
            {
                this.playerOrange.anims.stop()
                this.playerOrange.setTexture('o_stand')
            }
        });
        this.input.keyboard.on('keydown-K', () => {
            if (this.playerOrange.mode == "move") {
                this.playerOrange.moveDirection(4)
                this.playerOrange.anims.play('O_SW_Walk_Animation', true)
            }
        });
        this.input.keyboard.on('keyup-K', () => {
            {
                this.playerOrange.anims.stop()
                this.playerOrange.setTexture('o_stand')
            }
        });
        this.input.keyboard.on('keydown-U', () => {
            if (this.playerOrange.mode == "move") {
                this.playerOrange.toggleMode();
            }
            else {
                this.playerOrange.throwDiskFromPlayer();
                this.playerOrange.deleteLine();
            }
        });
        this.input.keyboard.on('keydown-N', () => {
            this.playerOrange.deleteLine();
            this.playerOrange.throwDiskFromPlayer();

        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.sound.stopAll();
            this.scene.start('menuScene');
        });

        // turns on physics debug mode
        this.input.keyboard.on('keydown-G', function () {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)
        
        // create disk collider 
        this.physics.add.collider(this.playerBlue, this.orangeDisksGroup, (playerBlue, orangeDisksGroup) => {
            console.log("SUCCESS blue player hit by orange disk")
            this.sound.play('sfx-yoda');
            this.scoreOrange += 1
            this.sfxDeathBoom.play()
            // add death code here
            const emitters = this.add.particles(playerBlue.x, playerBlue.y, 'hexBlue', {
                emitting: false,
                speed: { min: 50, max: 200 },
                advance: 2000,
                lifespan: 700,
                sortOrderAsc: true,
                scale: { start: 0.2, end: .5 },
                blendMode: 'ADD',
                colors: 0x0000FF,
                scale: .3

            })
            emitters.emitting = true
            emitters.explode(30)
            playerBlue.setAlpha(0)
            this.time.delayedCall(2000, () => {
                this.sound.stopAll();
                this.scene.restart({ scoreBlue: this.scoreBlue, scoreOrange: this.scoreOrange, timeRemaining: this.timeRemaining });
            });
            // reset mechanic
        })

        this.physics.add.collider(this.playerOrange, this.blueDisksGroup, (playerOrange, blueDisksGroup) => {
            console.log("SUCCESS orange player hit by blue disk")
            this.sound.play('sfx-tacobell');
            this.scoreBlue += 1
            this.sfxDeathBoom.play()
            // reset mechanic
            const emitters = this.add.particles(playerOrange.x, playerOrange.y, 'hexOrange', {
                emitting: false,
                speed: { min: 50, max: 200 },
                advance: 2000,
                lifespan: 700,
                sortOrderAsc: true,
                blendMode: 'ADD',
                scale: { start: 0.2, end: .5 },
                colors: 0xFFA500,
                scale: .3

            })
            emitters.emitting = true
            emitters.explode(30)
            playerOrange.setAlpha(0);
            this.time.delayedCall(2000, () => {
                this.sound.stopAll();
                this.scene.restart({ scoreBlue: this.scoreBlue, scoreOrange: this.scoreOrange, timeRemaining: this.timeRemaining });
            });
        })
        this.physics.add.overlap(this.blueDisksGroup, this.orangeTilesGroup, this.handleDiskTileOverlap, null, this);
        this.physics.add.overlap(this.orangeDisksGroup, this.blueTilesGroup, this.handleDiskTileOverlap, null, this);
    }

    isValidTile(player, board, x, y) { // Basically, if the tile that is being checked exists on the screen then it is valid. Otherwise no.
        return board.validTiles.some(tile => tile.x === x && tile.y === y) && (player.x >= 20 && player.x <= 780 && player.y >= 20 && player.y <= 580);
    }

    handleDiskTileOverlap(disk, tile) {
        console.log("Disk overlapped with tile");
        this.destroyHexesOnContact(disk);
    }

    destroyHexesOnContact(object) {
        if (object.texture.key == 'diskOrange') {
            this.blueTilesGroup.getChildren().forEach(tile => {
                if (this.physics.overlap(object, tile)) {
                    tile.setVisible(false);
                    tile.setActive(false);
                    tile.setImmovable(false);
                    tile.destroy();
                }
            });
        }

        if (object.texture.key == 'diskBlue') {
            this.orangeTilesGroup.getChildren().forEach(tile => {
                if (this.physics.overlap(object, tile)) {
                    tile.setVisible(false);
                    tile.setActive(false);
                    tile.setImmovable(false);
                    tile.destroy();
                }
            });
        }
    }

    updateTimer() {
        this.timeRemaining--;
        this.timerText.setText(`Time Remaining: ${this.timeRemaining}\nScore: ${this.scoreBlue}-${this.scoreOrange}`);
    
        if (this.timeRemaining <= 0) { // End of game condition
            this.timeRemaining = 0;
            this.sound.stopAll();
            this.scene.start('menuScene');
        }
    }
    
}
