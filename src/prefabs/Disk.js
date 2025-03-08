class Disk extends Phaser.GameObjects.Image {
    constructor(scene, sourceBoard, targetBoard, startTileXY, targetTileXY, color) { // You have no idea how long it took me to actually get the colors to match.
        let startWorldXY = sourceBoard.tileXYToWorldXY(startTileXY.x, startTileXY.y);
        if (color == "blue") {
            super(scene, startWorldXY.x, startWorldXY.y, "diskBlue");
        }
        else{
            super(scene, startWorldXY.x, startWorldXY.y, "diskOrange");
        }

        scene.add.existing(this);

        this.sourceBoard = sourceBoard;
        this.targetBoard = targetBoard;
        this.targetTileXY = targetTileXY;

        this.speed = 1500; // Felt 1500 mS was enough. Lmk what you think.
        this.setScale(0.25);
        this.setOrigin(0.5, 0.5);
    }

    throwDisk() {
        let targetWorldXY = this.targetBoard.tileXYToWorldXY(this.targetTileXY.x, this.targetTileXY.y);

        this.scene.tweens.add({
            targets: this,
            x: targetWorldXY.x,
            y: targetWorldXY.y,
            duration: this.speed,
            ease: 'Cubic.easeOut', // Love that nonlinear acceleration/deceleration
            onComplete: () => {
                this.destroy();
            }
        });
    }


}
