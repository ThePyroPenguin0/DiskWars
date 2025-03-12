class Disk extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, sourceBoard, targetBoard, startTileXY, targetTileXY, color) { // You have no idea how long it took me to actually get the colors to match.
        let startWorldXY = sourceBoard.tileXYToWorldXY(startTileXY.x, startTileXY.y);
        if (color == "blue") {
            super(scene, startWorldXY.x, startWorldXY.y, "diskBlue");
            // detects if blue player threw blue disk, adds it to blueDisk group used for collisions
            this.scene.blueDisksGroup.add(this)
            console.log("blue disk added to blueDisk group")
            
        }
        else{
            super(scene, startWorldXY.x, startWorldXY.y, "diskOrange");
            // detects if orange player threw orange disk, adds it to orangeDisk group used for collisions
            this.scene.orangeDisksGroup.add(this)
            console.log("orange disk added to orangeDisk group")
        }
        scene.add.existing(this);
        // loads physics body into scene 
        scene.physics.add.existing(this)
        this.body.setCircle(this.width/4)
        this.body.offset.x = this.height/4
        this.body.offset.y = this.width/4
        this.body.onCollide = true // allows collisions


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
