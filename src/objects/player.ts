import Phaser from "phaser";
import { gameConfig, gameOptions } from "../gameConf/config";

type PlayerType = {
  scene: any,
  x: number,
  y: number,
}

class Player extends Phaser.GameObjects.Sprite {  
  delayTembak: number
  constructor(config: PlayerType) {
    const {scene, x, y} = config;
    super(scene, x, y, "flappy-yellow");
    this.delayTembak = 0

    scene.physics.world.enableBody(this);
    scene.add.existing(this)
    this.displayWidth = 20
    this.displayHeight = 13
    if('setSize' in this.body) {
      this.body.setSize(50,50, true)
    }
    // this.setScale(.2)
    this.setDepth(1)
    
    if('setVelocity' in this.body) {
      this.body.setCollideWorldBounds(true);
      this.body.setImmovable(true)
    }
  }

  handleCollide(wallobj:any) {
    console.log(wallobj.body.width, wallobj.body.height)
    if('setVelocity' in this.body) {
      this.body.setImmovable(false)
    }
  }

  update(time: number, delta: number): void {
    const {keys} = gameConfig

    if('setVelocity' in this.body) {
    this.body.setVelocity(0,0)
    if(keys.a.isDown) {
        // this.body.setVelocity(-150, 0)
        this.body.setVelocityX(-200)
      }
      if(keys.d.isDown) {
        // this.body.setVelocity(200, 0)
        this.body.setVelocityX(200)
      }
      if(keys.w.isDown) {
        // this.body.setVelocity(0, -200)
        this.body.setVelocityY(-200)
      }
      if(keys.s.isDown) {
        // this.body.setVelocity(0, 200)
        this.body.setVelocityY(200)
      }
    }

    // if(keys.space.isDown) {
    //   let fireBullet = null
    //   if("x" in this.body) {
    //     this.delayTembak += delta
    //     if(this.delayTembak > 200) {
    //       fireBullet = new Bullet({scene: this.scene, x: this.body.x, y: this.body.y})
          
    //       fireBullet.setCollider(fireBullet)
    //       this.delayTembak = 0
    //     }
    //   }
      
    // }
  }
}

export default Player;