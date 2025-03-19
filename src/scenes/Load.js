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
        this.load.audio('sfx-vineboom','./assets/vine-boom.mp3');
        this.load.audio('sfx-yoda', './assets/lego-yoda-death-sound-effect.mp3');
        this.load.audio('sfx-tacobell', './assets/taco-bell-bong-sfx.mp3');
        this.load.audio('sfx-background','./assets/synthwave_background.mp3')
        this.load.audio('sfx-deathBoom','./assets/death_boom.mp3')
        this.load.audio('sfx-win','./assets/win_sound.mp3')
        this.load.audio('sfx-tied','./assets/tied_sound.mp3')
        this.load.audio('sfx-blip','./assets/blip.mp3')
        this.load.audio('sfx-woosh','./assets/woosh.mp3')
        this.load.audio('sfx-crash','./assets/crash.mp3')
        this.load.audio('sfx-menuMusic','./assets/menu_music.mp3')
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
        this.load.spritesheet('blue_nw_walk', './assets/blue_NW_walk_animation.png',{
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
        this.load.spritesheet('blue_se_walk','./assets/blue_SE_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('blue_sw_walk','./assets/blue_SW_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('orange_se_walk','./assets/orange_SE_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('orange_sw_walk','./assets/orange_SW_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('blue_e_walk','./assets/blue_E_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 7
        })
        this.load.spritesheet('blue_w_walk','./assets/blue_W_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 7
        })
        this.load.spritesheet('orange_w_walk','./assets/orange_W_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 7
        })
        this.load.spritesheet('orange_e_walk','./assets/orange_E_walk_animation.png',{
            frameWidth:32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 7
        })
        this.load.image('b_stand','./assets/blue_e_stand.png');
        this.load.image('o_stand','./assets/orange_w_stand.png');
        this.load.image('hexBlue', 'assets/hexBlue.png');
        this.load.image('hexOrange', 'assets/hexOrange.png');
        this.load.image('diskBlue', './assets/diskBlue.png');
        this.load.image('diskOrange', './assets/diskOrange.png');
        this.load.image('credits','./assets/credits.png');
        this.load.image('p1_win','./assets/p1_win.png');
        this.load.image('p2_win','./assets/p2_win.png');
        this.load.image('tied','./assets/tied.png');
        
    }
    create(){
        this.scene.start('menuScene')
        this.anims.create({
            key: 'O_NW_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_nw_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'O_NE_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_ne_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'B_NW_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_nw_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'B_NE_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_ne_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'B_SE_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_se_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'B_SW_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_sw_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'O_SW_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_sw_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'O_SE_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_se_walk',{start: 0, end: 6, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'O_E_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_e_walk',{start: 0, end: 7, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'O_W_Walk_Animation',
            frames: this.anims.generateFrameNames('orange_w_walk',{start: 0, end: 7, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'B_E_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_e_walk',{start: 0, end: 7, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'B_W_Walk_Animation',
            frames: this.anims.generateFrameNames('blue_w_walk',{start: 0, end: 7, first:0}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'backgroundAnim',
            frames: this.anims.generateFrameNumbers('backgroundTiles', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
    }
       
}