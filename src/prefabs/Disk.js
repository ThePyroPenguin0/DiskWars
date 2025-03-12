class Disk extends Phaser.Physics.Arcade.Image {
    constructor(scene, sourceBoard, targetBoard, startTileXY, throwAngle, color) {
        let startWorldXY = sourceBoard.tileXYToWorldXY(startTileXY.x, startTileXY.y);
        if (color == "blue") {
            super(scene, startWorldXY.x, startWorldXY.y, "diskBlue");
        } else {
            super(scene, startWorldXY.x, startWorldXY.y, "diskOrange");
        }

        this.throwAngle = throwAngle;
        // Add the disk to the physics world
        scene.physics.world.enable(this);
        scene.add.existing(this);

        // Set the disk's properties
        this.sourceBoard = sourceBoard;
        this.targetBoard = targetBoard;

        // Set the scale and origin
        this.setScale(0.25);
        this.setOrigin(0.5, 0.5);

        // Set the collider size to match the image
        this.setSize(this.width, this.height);
    }

throwDisk() {
    // Convert the angle to radians
    let radians = Phaser.Math.DegToRad(this.throwAngle); // This matches the angle used in emitLine()

    let speed = 800; // Set the speed of the disk

    // Set the velocity of the disk in the direction of the angle
    this.setVelocity(
        Math.cos(radians) * speed,  // X velocity based on the angle
        Math.sin(radians) * speed   // Y velocity based on the angle
    );

    // Set bounce off walls (collide with world bounds)
    this.setBounce(1);

    // Set lifetime for the disk
    this.scene.time.delayedCall(1000, () => {
        this.destroy();
        console.log("Disk destroyed after 500ms.");
    });

    // Enable collision with the world bounds
    this.setCollideWorldBounds(true);
}

}
