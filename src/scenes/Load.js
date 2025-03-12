class Load extends Phaser.Scene{
    constructor(){
        super('loadScene') // TO DO!
    }

    preload(){
         // creates a loading bar at start of game while assets load
    let loadingBar = this.add.graphics()
    this.load.on('progress', (value)=>{
        loadingBar.clear()
        loadingBar.fillStyle(0x00FFFF,1)
        loadingBar.fillRect(0, 300, 800 * value, 5)
    })
    this.load.on('complete',()=>{
        loadingBar.destroy()
    })
        this.load.audio('sfx-background','./assets/synthwave_background.mp3')
        this.load.spritesheet('orange_nw_walk', './assets/orange_NW_walk_animation.png',{
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('backgroundTiles', 'assets/title_screen.png', {
            frameWidth: 250,
            frameHeight: 300
        });
        this.load.spritesheet('orange_ne_walk','./assets/orange_NE_walk_animation.png',{
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('blue_nw_walk', './assets/blassets/bule_NW_walk_animation.pngue_NW_walk_animation.png',{
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('blue_ne_walk','./assets/blue_NE_walk_animation.png',{
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.image('o_player_temp','./assets/o_player_temp.png')
        this.load.image('b_player_temp','./assets/b_player_temp.png')
        this.load.image('hexBlue', 'assets/hexBlue.png');
        this.load.image('hexOrange', 'assets/hexOrange.png');
        this.load.image('diskBlue', './assets/diskBlue.png');
        this.load.image('diskOrange', './assets/diskOrange.png');
        
    }
    create(){
        this.scene.start('menuScene')
        this.anims.create({
            key: 'O_NW_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_nw_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 15
        })
        this.anims.create({
            key: 'O_NE_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_ne_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 15
        })
        this.anims.create({
            key: 'B_NW_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_nw_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 15
        })
        this.anims.create({
            key: 'B_NE_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_ne_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 15
        })
        this.anims.create({
            key: 'backgroundAnim',
            frames: this.anims.generateFrameNumbers('backgroundTiles', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
    }
       
}