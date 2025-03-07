class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, board, startX, startY, color = 0xFFFF00) {

        super(scene, startX, startY, color);
        scene.add.existing(this);

        this.scene = scene;
        this.board = board;
        this.tileXY = { x: startX, y: startY };

        let worldXY = board.tileXYToWorldXY(startX, startY);
        this.setPosition(worldXY.x, worldXY.y);
        this.sprite = scene.add.circle(worldXY.x, worldXY.y, 8, color);


        this.speed = 100;

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
            }
        });
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
}
