class Disk extends Phaser.Physics.Arcade.Image {
    constructor(scene, sourceBoard, targetBoard, startTileXY, throwAngle, color) {
        let startWorldXY = sourceBoard.tileXYToWorldXY(startTileXY.x, startTileXY.y);
        if (color == "blue") {
            super(scene, startWorldXY.x, startWorldXY.y, "diskBlue");
        } else {
            super(scene, startWorldXY.x, startWorldXY.y, "diskOrange");
        }

        this.throwAngle = throwAngle;
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.sourceBoard = sourceBoard;
        this.targetBoard = targetBoard;

        this.setScale(0.25);
        this.setOrigin(0.5, 0.5);

        this.setSize(this.width, this.height);

        this.initialSpeed = 1000; 
        this.decelerationFactor = 0.98;
    }

    throwDisk() {
        let radians = Phaser.Math.DegToRad(this.throwAngle);

        this.setVelocity(
            Math.cos(radians) * this.initialSpeed,
            Math.sin(radians) * this.initialSpeed
        );

        this.setBounce(1);
        this.setCollideWorldBounds(true);

        this.scene.events.on('update', this.slowDownDisk, this);

        this.scene.time.delayedCall(1500, () => {
            this.destroy();
            console.log("Disk destroyed after 1000ms.");
        });
    }

    slowDownDisk() {
        if (!this.active) {
            return;
        }

        this.setVelocity(
            this.body.velocity.x * this.decelerationFactor,
            this.body.velocity.y * this.decelerationFactor
        );
    }
}
