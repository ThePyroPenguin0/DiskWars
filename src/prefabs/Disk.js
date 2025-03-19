
class Disk extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, sourceBoard, targetBoard, startTileXY, throwAngle, color) {
        let startWorldXY = sourceBoard.tileXYToWorldXY(startTileXY.x, startTileXY.y);
        if (color == "blue") {

            super(scene, startWorldXY.x, startWorldXY.y, "diskBlue");
            // detects if blue player threw blue disk, adds it to blueDisk group used for collisions
            this.scene.blueDisksGroup.add(this)
            // console.log("blue disk added to blueDisk group")

        }
        else {
            super(scene, startWorldXY.x, startWorldXY.y, "diskOrange");
            // detects if orange player threw orange disk, adds it to orangeDisk group used for collisions
            this.scene.orangeDisksGroup.add(this)
            // console.log("orange disk added to orangeDisk group")
        }
       
        this.y -= 25;
        this.throwAngle = throwAngle;
        scene.physics.world.enable(this);

        scene.add.existing(this);
        this.setScale(0.30);
        this.setOrigin(0.5, 0.5);

        scene.physics.add.existing(this)
        this.body.setSize(this.width, this.height)
        this.body.setCircle(this.width / 4)
        this.body.offset.x = this.height / 4
        this.body.offset.y = this.width / 4
        this.body.onCollide = true



        this.sourceBoard = sourceBoard;
        this.targetBoard = targetBoard;



        // this.setSize(this.width, this.height);

        this.initialSpeed = 1500;
        this.decelerationFactor = 0.98;

        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', this.handleWorldBoundsCollision, this);
    }

    throwDisk() {
        let radians = Phaser.Math.DegToRad(this.throwAngle);

        this.setVelocity(
            Math.cos(radians) * this.initialSpeed,
            Math.sin(radians) * this.initialSpeed
        );

        this.setBounce(1); // Enable bounce for world bounds
        this.setCollideWorldBounds(true);

        this.scene.events.on('update', this.slowDownDisk, this);

        this.scene.time.delayedCall(1500, () => {
            this.scene.sfxCrash.play()
            this.destroy();
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
        this.rotation += 5;
    }

    handleWorldBoundsCollision(body, up, down, left, right) {
        if (body.gameObject === this) {
            
            this.scene.sfxVineBoom.play(); // Play the collision sound
            this.scene.cameras.main.shake(200, 0.01);
        }
    }
}
