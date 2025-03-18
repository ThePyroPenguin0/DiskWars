class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, board, startX, startY, texture, color = 0xFFA500) {
        super(scene, startX, startY, texture, color);
        scene.add.existing(this);
        // adds physics body to disk
        scene.physics.add.existing(this)
        this.body.setSize(this.width*0.27, this.height)
        this.body.setOffset(11,0)
        //this.setOrigin(0,0)
        this.body.setImmovable()
        this.body.onCollide = true
        this.score = 0;
        if (color == 0x0000FF) {
            this.color = "blue";
            this.throwAngle = -45;
        }
        else if (color == 0xFFA500) {
            this.color = "orange"
            this.throwAngle = 135;
        }
        this.scene = scene;
        this.board = board;
        this.tileXY = { x: startX, y: startY };

        let worldXY = board.tileXYToWorldXY(startX, startY);
        this.setPosition(worldXY.x, worldXY.y);
        this.sprite = scene.add.circle(worldXY.x, worldXY.y, 0, color);

        this.targetTileXY = { x: startX, y: startY };

        this.speed = 100;
        this.mode = "move"; // "move" or "target" are valid modes
        this.enemy;

        this.screenBounds = {
            left: 0,
            right: 800,
            top: 0,
            bottom: 600
        };
    }

    isTileActive(x, y) {
        let worldXY = this.board.tileXYToWorldXY(x, y);
        let tileGroup = this.color === "blue" ? this.scene.blueTilesGroup : this.scene.orangeTilesGroup;
        let tile = tileGroup.getChildren().find(tile => tile.x === worldXY.x && tile.y === worldXY.y);
        return tile && tile.active;
    }

    moveTo(x, y) {
        let worldXY = this.board.tileXYToWorldXY(x, y);

        if (
            !this.board.validTiles.some(tile => tile.x === x && tile.y === y) ||
            worldXY.x <= this.screenBounds.left ||
            worldXY.x >= this.screenBounds.right ||
            worldXY.y <= this.screenBounds.top ||
            worldXY.y >= this.screenBounds.bottom ||
            !this.isTileActive(x, y)
        ) {
            console.log(`Illegal traversal detected. Cannot move from (${this.tileXY.x}, ${this.tileXY.y}) to forbidden tile (${x}, ${y}).`);
            return;
        }

        this.scene.tweens.add({
            targets: [this, this.sprite],
            x: worldXY.x,
            y: worldXY.y,
            duration: this.speed,
            ease: 'Linear',
            onComplete: () => {
                this.tileXY = { x, y };
                this.sprite.tileXY = { x, y };
                console.log(this.tileXY);
            }
        });
    }

    toggleMode() {
        this.mode = this.mode === "move" ? "target" : "move";
        console.log(`Mode switched to: ${this.mode}`);
        this.emitLine();
    }

    moveDirection(direction) {
        const directions = [
            { x: 1, y: 0 },  // Right 0
            { x: 1, y: -1 }, // Up-Right 1
            { x: 0, y: -1 }, // Up-Left 2
            { x: -1, y: 0 }, // Left 3
            { x: 0, y: 1 }, // Down-Left 4
            { x: 1, y: 1 }   // Down-Right 5
        ];
        // this.anims.play('B_NW_Walk_Animation');
        let newX = this.tileXY.x + directions[direction].x;
        let newY = this.tileXY.y + directions[direction].y;

        this.moveTo(newX, newY);
    }

    changeDiskAngle(key) {
        if (key === "d") {
            this.throwAngle += 5;
        }
        else if (key === "a") {
            this.throwAngle -= 5;
        }
        console.log("New angle: " + this.throwAngle);
        this.emitLine();
    }

    throwDiskFromPlayer() {
        if(this.disk){
            return;
        }
        this.disk = new Disk(this.scene, this.board, this.opposingBoard, this.tileXY, this.throwAngle, this.color);
        if(this.color == "blue"){
            this.scene.blueDiskThrown = true;
        }
        else{
            this.scene.orangeDiskThrown = true;
        }
        this.disk.throwDisk();
        //console.log(`Throwing disk from (${this.tileXY.x}, ${this.tileXY.y})`);
        if (this.mode == "target") {
            this.mode = "move";
            console.log("Switched mode to move.")
        }

        this.scene.time.delayedCall(1500, () => {
            console.log("Disk destroyed after 1000ms.");
            if (this.color == "blue") { this.scene.blueDiskThrown = false; }
            else { this.scene.orangeDiskThrown = false; }
            this.disk = null;
        });
    }


    emitLine() {
        if (this.lineGraphics) {
            this.lineGraphics.clear();
            this.lineGraphics.destroy();
        }

        if (this.color === 'blue') {
            this.lineGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x0000FF } });
        } else {
            this.lineGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xFFA500 } });
        }


        let radians = Phaser.Math.DegToRad(this.throwAngle);
        let lineLength = 200;
        let deltaX = Math.cos(radians) * lineLength;
        let deltaY = Math.sin(radians) * lineLength;
        let worldStart = this.board.tileXYToWorldXY(this.tileXY.x, this.tileXY.y);
        let worldEndX = worldStart.x + deltaX;
        let worldEndY = worldStart.y + deltaY;

        if (this.board === this.scene.playerBlue.board) {
            this.opposingBoard = this.scene.playerOrange.board;
        } else {
            this.opposingBoard = this.scene.playerBlue.board;
        }
        this.lineGraphics.strokeLineShape(new Phaser.Geom.Line(worldStart.x, worldStart.y, worldEndX, worldEndY));
        console.log(`Drawing line from (${worldStart.x}, ${worldStart.y}) to (${worldEndX}, ${worldEndY}) in direction ${this.throwAngle}°`);
    }

    deleteLine() {
        if (this.lineGraphics) {
            this.lineGraphics.clear();
            this.lineGraphics.destroy();
        }
    }
}