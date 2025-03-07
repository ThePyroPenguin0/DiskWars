class Play extends Phaser.Scene {
    preload() {
        this.load.image('hexBlue', 'assets/hexBlue.png');
        this.load.image('hexOrange', 'assets/hexOrange.png');
        this.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
    }

    constructor() {
        super('playScene');
    }

    create() {
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

        this.playerBlue = new Player(this, boardBlue, 10, 10, 0x0000FF);
        this.playerOrange = new Player(this, boardOrange, 10, 20, 0xFFA500);

        this.input.keyboard.on('keydown-D', () => this.playerBlue.moveDirection(0));
        this.input.keyboard.on('keydown-W', () => this.playerBlue.moveDirection(2));
        this.input.keyboard.on('keydown-A', () => this.playerBlue.moveDirection(3));
        this.input.keyboard.on('keydown-S', () => this.playerBlue.moveDirection(4));

        this.input.keyboard.on('keydown-L', () => this.playerOrange.moveDirection(0));
        this.input.keyboard.on('keydown-I', () => this.playerOrange.moveDirection(2));
        this.input.keyboard.on('keydown-J', () => this.playerOrange.moveDirection(3));
        this.input.keyboard.on('keydown-K', () => this.playerOrange.moveDirection(4));
    }

    isValidTile(player, board, x, y) {
        return board.validTiles.some(tile => tile.x === x && tile.y === y) && (player.x >= 20 && player.x <= 780 && player.y >= 20 && player.y <= 580);
    }
}
