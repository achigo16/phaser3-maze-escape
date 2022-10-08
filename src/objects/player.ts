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
    this.setScale(.2)
    this.setDepth(1)
    
    if('setVelocity' in this.body) {
      this.body.setCollideWorldBounds(true);
      this.body.setImmovable(true)
    }
  }

  handleCollide(wallobj:any) {
    if('setVelocity' in this.body) {
      this.body.setImmovable(false)
    }
  }

  update(time: number, delta: number): void {
    const {keys} = gameConfig

    if('setVelocity' in this.body) {
      if(keys.a.isDown) {
        // this.body.setVelocity(-150, 0)
        this.body.setVelocityX(-100)
      }
      if(keys.d.isDown) {
        // this.body.setVelocity(100, 0)
        this.body.setVelocityX(100)
      }
      if(keys.w.isDown) {
        // this.body.setVelocity(0, -100)
        this.body.setVelocityY(-100)
      }
      if(keys.s.isDown) {
        // this.body.setVelocity(0, 100)
        this.body.setVelocityY(100)
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