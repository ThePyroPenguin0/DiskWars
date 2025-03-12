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
    }

throwDisk() {
    let radians = Phaser.Math.DegToRad(this.throwAngle);

    let speed = 800; 

    this.setVelocity(
        Math.cos(radians) * speed,  // X velocity based on the angle
        Math.sin(radians) * speed   // Y velocity based on the angle
    );

    this.setBounce(1);
    this.scene.time.delayedCall(1000, () => {
        this.destroy();
        console.log("Disk destroyed after 500ms.");
    });

    this.setCollideWorldBounds(true);
}

}
