import Phaser from "phaser";
import { gameConfig, gameOptions } from "../gameConf/config";

type PlayerType = {
  scene: any,
  x: number,
  y: number,
}

class Player extends Phaser.GameObjects.Sprite {  
  delayTembak: number
  r1: any;
  constructor(config: PlayerType) {
    const {scene, x, y} = config;
    super(scene, x, y, "player");
    this.delayTembak = 0

    this.r1 = scene.add.rectangle(x, y, gameOptions.tileSize - 3, gameOptions.tileSize - 3, 0x6666ff);
    // scene.add.rectangle(
    //   x, 
    //   y, 
    //   gameOptions.tileSize - 3, 
    //   gameOptions.tileSize - 3, 
    //   0x6666ff);
    // scene.physics.world.enableBody(this);
    scene.physics.add.existing(this.r1);
    scene.add.existing(this.r1)
    // this.setScale(1)
    
    if('setVelocity' in this.r1.body) {
      this.r1.body.setCollideWorldBounds(true);
      this.r1.body.setImmovable(true)
    }
  }

  handleCollide() {
    console.log("PESAWAT TERTABRAK")
  }

  update(time: number, delta: number): void {
    const {keys} = gameConfig

    if('setVelocity' in this.r1.body) {
      // this.r1.body.setVelocity(0)
      if(keys.a.isDown) {
        this.r1.body.setVelocity(-150, 0)
      }
      if(keys.d.isDown) {
        this.r1.body.setVelocity(150, 0)
      }
      if(keys.w.isDown) {
        this.r1.body.setVelocity(0, -150)
      }
      if(keys.s.isDown) {
        this.r1.body.setVelocity(0, 150)
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