class Play extends Phaser.Scene {
    preload() {
        this.load.image('hexBlue', 'assets/hexBlue.png');
        this.load.image('hexOrange', 'assets/hexOrange.png');
        this.load.image('diskBlue', './assets/diskBlue.png');
        this.load.image('diskOrange', './assets/diskOrange.png');
        
        this.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
    
    }

    constructor() {
        super('playScene');
    }

    create() {
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

        // What the fuck is an originality? Thank God Rex has such good documentation.
        let tileXYArray = boardBlue.fit(this.rexBoard.hexagonMap.parallelogram(boardBlue, 0, 15, 30));
        let tileXYArray2 = boardOrange.fit(this.rexBoard.hexagonMap.parallelogram(boardOrange, 0, 15, 30));

        let graphics = this.add.graphics();
        let graphics2 = this.add.graphics();

        boardBlue.validTiles = [];
        boardOrange.validTiles = [];


        let tileXY;
        for (let i in tileXYArray) {
            tileXY = tileXYArray[i];
            graphics.strokePoints(boardBlue.getGridPoints(tileXY.x, tileXY.y, true), true);
            boardBlue.validTiles.push(tileXY);
        }
        for (let i in tileXYArray2) {
            tileXY = tileXYArray2[i];
            graphics2.strokePoints(boardOrange.getGridPoints(tileXY.x, tileXY.y, true), true);
            boardOrange.validTiles.push(tileXY);
        }

        for (let tileXY of tileXYArray) {
            let worldXY = boardBlue.tileXYToWorldXY(tileXY.x, tileXY.y);
            this.add.image(worldXY.x, worldXY.y, 'hexBlue').setScale(0.5, 0.25).setOrigin(0.5);
        }

        for (let tileXY of tileXYArray2) {
            let worldXY = boardOrange.tileXYToWorldXY(tileXY.x, tileXY.y);
            this.add.image(worldXY.x, worldXY.y, 'hexOrange').setScale(0.5, 0.25).setOrigin(0.5);
        }

        this.playerBlue = new Player(this, boardBlue, 10, 10, 'b_player_temp',0x0000FF); // Blue player with blue color code. Currently used for positioning and for the Disk creation
        this.playerOrange = new Player(this, boardOrange, 10, 20, 'o_player_temp',0xFFA500); // Orange player with orange color code
        //makes scale larger 
        this.playerBlue.setScale(2.5)
        this.playerOrange.setScale(2.5)
        this.input.keyboard.on('keydown-D', () => { // Decided to have hexes but only four movement directions. It actually works surprisingly well.
            if (this.playerBlue.mode == "move") { this.playerBlue.moveDirection(0) }
            else if (this.playerBlue.mode == "target") {
                this.playerBlue.moveReticle(0);
            }
        });
        this.input.keyboard.on('keydown-W', () => {
            if (this.playerBlue.mode == "move") { this.playerBlue.moveDirection(2) }
            else if (this.playerBlue.mode == "target") { this.playerBlue.moveReticle(2) }
        });
        this.input.keyboard.on('keydown-A', () => {
            if (this.playerBlue.mode == "move") { this.playerBlue.moveDirection(3) }
            else if (this.playerBlue.mode == "target") { this.playerBlue.moveReticle(3) }
        });
        this.input.keyboard.on('keydown-S', () => {
            if (this.playerBlue.mode == "move") { this.playerBlue.moveDirection(4) }
            else if (this.playerBlue.mode == "target") { this.playerBlue.moveReticle(4) }
        });
        this.input.keyboard.on('keydown-E', () => {
            if (this.playerBlue.mode == "move") {
                this.playerBlue.toggleMode();
                this.playerBlue.setReticle(); // To be changed as game gets further along. THIS IS A DEBUG STATE!
            }
            else {
                this.playerBlue.throwDiskFromPlayer();
                this.playerBlue.toggleMode();
            }
        });

        this.input.keyboard.on('keydown-L', () => {
            this.playerOrange.moveDirection(0)
        });
        this.input.keyboard.on('keydown-I', () => {
            this.playerOrange.moveDirection(2)
        });
        this.input.keyboard.on('keydown-J', () => {
            this.playerOrange.moveDirection(3)
        });
        this.input.keyboard.on('keydown-K', () => {
            this.playerOrange.moveDirection(4)
        });
        this.input.keyboard.on('keydown-U', () => {
            if (this.playerOrange.mode == "move") {
                this.playerOrange.toggleMode()
                this.playerOrange.setReticle();
            }
            else {
                this.playerOrange.throwDiskFromPlayer();
                this.playerOrange.toggleMode(); // To be changed as game gets further along.
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('menuScene');
        });
    }

    isValidTile(player, board, x, y) { // Basically, if the tile that is being checked exists on the screen then it is valid. Otherwise no.
        return board.validTiles.some(tile => tile.x === x && tile.y === y) && (player.x >= 20 && player.x <= 780 && player.y >= 20 && player.y <= 580);
    }
}
