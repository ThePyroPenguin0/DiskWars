class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, board, startX, startY, color = 0xFFA500) {
        super(scene, startX, startY, color);
        scene.add.existing(this);
        if(color == 0x0000FF){
            this.color = "blue";
        }
        else if (color == 0xFFA500){
            this.color = "orange"
        }
        this.scene = scene;
        this.board = board;
        // this.reticleMirroredX = false; # To be determined if this is even implementable. Fuck mirroring and all it stand for.
        // this.reticleMirroredY = false;
        this.tileXY = { x: startX, y: startY };

        let worldXY = board.tileXYToWorldXY(startX, startY);
        this.setPosition(worldXY.x, worldXY.y);
        this.sprite = scene.add.circle(worldXY.x, worldXY.y, 8, color);

        this.targetingReticle = scene.add.circle(worldXY.x, worldXY.y, 6, 0xFF0000); // Red targeting reticle. Should we leave it as is? I think it's fine
        this.targetTileXY = { x: startX, y: startY };
        this.targetingReticle.setVisible(false);

        this.speed = 100;
        this.mode = "move"; // "move" or "target" are valid modes

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
        this.targetingReticle.setVisible(this.mode === "target");

        if (this.mode === "target") {
            let opposingBoard = (this.board === this.scene.playerBlue.board)
                ? this.scene.playerOrange.board
                : this.scene.playerBlue.board;

            let closestTile = opposingBoard.validTiles.reduce((closest, tile) => {
                let dx = tile.x - this.tileXY.x;
                let dy = tile.y - this.tileXY.y;
                let dist = dx * dx + dy * dy;
                return dist < (closest.dist || Infinity) ? { x: tile.x, y: tile.y, dist } : closest;
            }, {});

            if (closestTile.x !== undefined && closestTile.y !== undefined) {
                this.targetTileXY = { x: closestTile.x, y: closestTile.y };
                let worldXY = opposingBoard.tileXYToWorldXY(closestTile.x, closestTile.y);
                this.targetingReticle.setPosition(worldXY.x, worldXY.y);
            }

            this.opposingBoard = opposingBoard; // I know it looks useless, but this is actually critical for ensuring that line 155 works so that there is a list of valid places the reticle can be.
        }

        console.log(`Mode switched to: ${this.mode}`);
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
        let newX = this.tileXY.x + directions[direction].x;
        let newY = this.tileXY.y + directions[direction].y;

        this.moveTo(newX, newY);
    }

    setReticle() {
        let targetTileXY;
    
        // If the board is blue, set the reticle to (7, 29) on the orange board
        if (this.board === this.scene.playerBlue.board) {
            targetTileXY = { x: 7, y: 29 };
        }

        // See above
        else {
            targetTileXY = { x: 15, y: 15 };
        }

        // Ternary statements. I can't believe this was the easy path
        let opposingBoard = (this.board === this.scene.playerBlue.board) ? this.scene.playerOrange.board : this.scene.playerBlue.board;
    
        let worldXY = opposingBoard.tileXYToWorldXY(targetTileXY.x, targetTileXY.y);
        this.targetingReticle.setPosition(worldXY.x, worldXY.y);
        this.targetTileXY = { x: targetTileXY.x, y: targetTileXY.y };
    
        console.log(`Reticle moved to (${targetTileXY.x}, ${targetTileXY.y})`);
    }
    

    moveReticle(direction) {
        const directions = [
            { x: 1, y: 0 },  // Right 0
            { x: 1, y: -1 }, // Up-Right 1
            { x: 0, y: -1 }, // Up-Left 2
            { x: -1, y: 0 }, // Left 3
            { x: 0, y: 1 }, // Down-Left 4
            { x: 1, y: 1 }   // Down-Right 5
        ];

        // Get old X/Y
        let currentX = this.targetTileXY.x;
        let currentY = this.targetTileXY.y;

        let newX = currentX + directions[direction].x;
        let newY = currentY + directions[direction].y;

        // It's a duplicate but it's also me getting started on the bounce-shot mechanic. Also, fuck the bounce-shot mechanic.
        const xCollision = !this.opposingBoard.validTiles.some(tile => tile.x === newX && tile.y === currentY);
        const yCollision = !this.opposingBoard.validTiles.some(tile => tile.x === currentX && tile.y === newY);
        if (xCollision || yCollision) {
            console.log("Reticle collision detected. Staying within valid bounds.");
            return;
        }

        const worldXY = this.opposingBoard.tileXYToWorldXY(newX, newY);
        if (
            worldXY.x <= this.screenBounds.left || worldXY.x >= this.screenBounds.right || worldXY.y <= this.screenBounds.top || worldXY.y >= this.screenBounds.bottom) {
            console.log("Reticle out of bounds. Staying within valid screen bounds.");
            return;
        }

        this.targetTileXY = { x: newX, y: newY };
        this.targetingReticle.setPosition(worldXY.x, worldXY.y);
    }



    emitDisk(targetTileXY) {
        // Determine the opposing board: if we're on the blue board, the opposing realm is orange, and vice versa.
        let opposingBoard;
        if (this.board === this.scene.playerBlue.board) {
            opposingBoard = this.scene.playerOrange.board;
        } else {
            opposingBoard = this.scene.playerBlue.board;
        }

        let disk = new Disk(this.scene, this.board, opposingBoard, this.tileXY, targetTileXY, 0xFF00FF);

        this.targetingReticle.setVisible(false);
        disk.throwDisk();
    }

    // updateTrajectoryLine(bouncePath = []) { // DEBUG STUFF!
    //     if (!this.trajectoryLine) {
    //         this.trajectoryLine = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xFFFFFF } });
    //     }

    //     this.trajectoryLine.clear();
    //     this.trajectoryLine.lineStyle(2, 0xFFFFFF, 1);

    //     let playerWorldXY = this.board.tileXYToWorldXY(this.tileXY.x, this.tileXY.y);

    //     this.trajectoryLine.beginPath();
    //     this.trajectoryLine.moveTo(playerWorldXY.x, playerWorldXY.y);

    //     for (let point of bouncePath) {
    //         this.trajectoryLine.lineTo(point.x, point.y);
    //     }

    //     this.trajectoryLine.strokePath();
    // }

    throwDiskFromPlayer() {
        if (this.mode !== "target") {
            console.log("Player must be in 'target' mode to throw the disk.");
            return;
        }

        let targetTileXY = this.targetTileXY;
        let disk = new Disk(this.scene, this.board, this.opposingBoard, this.tileXY, targetTileXY, this.color);
        disk.throwDisk();
        console.log(`Throwing disk from (${this.tileXY.x}, ${this.tileXY.y}) to (${targetTileXY.x}, ${targetTileXY.y})`);
    }

}
