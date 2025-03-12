class Player extends Phaser.Physics.Arcade.Sprite  {
    constructor(scene, board, startX, startY, texture,color = 0xFFA500) {
        super(scene, startX, startY,texture, color);
        scene.add.existing(this);
        // adds physics body to disk
        scene.physics.add.existing(this) 
        this.body.setSize(this.width/4,this.height/2)
        //this.body.offset.y = 10
        this.body.setImmovable()
        this.body.onCollide = true
        if(color == 0x0000FF){
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
        this.sprite = scene.add.circle(worldXY.x, worldXY.y +30, 8, color);

        this.targetTileXY = { x: startX, y: startY };

        this.speed = 100;
        this.mode = "move"; // "move" or "target" are valid modes
        this.enemy ;

        this.screenBounds = {
            left: 0,
            right: 800,
            top: 0,
            bottom: 600
        };
    }

    moveTo(x, y) {
        let worldXY = this.board.tileXYToWorldXY(x, y);

        if (
            !this.board.validTiles.some(tile => tile.x === x && tile.y === y) ||
            worldXY.x <= this.screenBounds.left ||
            worldXY.x >= this.screenBounds.right ||
            worldXY.y <= this.screenBounds.top ||
            worldXY.y >= this.screenBounds.bottom
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

    emitDisk() {
        // Determine the opposing board: if we're on the blue board, the opposing realm is orange, and vice versa.
        let opposingBoard;
        if (this.board === this.scene.playerBlue.board) {
            opposingBoard = this.scene.playerOrange.board;
        } else {
            opposingBoard = this.scene.playerBlue.board;
        }
    
        let disk = new Disk(this.scene, this.board, opposingBoard, this.tileXY, this.throwAngle, 0xFF00FF);

        disk.throwDisk();
    }

    changeDiskAngle(key) {
        if (key === "d") {
            this.throwAngle += 1;
        }
        else if (key === "a") {
            this.throwAngle -= 1;
        }
        console.log("New angle: " + this.throwAngle);
        this.emitLine();
    }

    throwDiskFromPlayer() {
        let disk = new Disk(this.scene, this.board, this.opposingBoard, this.tileXY, this.throwAngle, this.color);
        disk.throwDisk();
        //console.log(`Throwing disk from (${this.tileXY.x}, ${this.tileXY.y})`);
        if (this.mode == "target") {
            this.mode = "move";
            console.log("Switched mode to move.")
        }
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

         let opposingBoard;
        if (this.board === this.scene.playerBlue.board) {
            opposingBoard = this.scene.playerOrange.board;
        } else {
            opposingBoard = this.scene.playerBlue.board;
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