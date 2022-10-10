import Phaser from "phaser";
import { gameConfig, gameOptions } from "../gameConf/config";

type PlayerType = {
  scene: any,
  x: number,
  y: number,
}

class Player extends Phaser.GameObjects.Sprite {  
  delayTembak: number = 0;
  isHitBoundaries: boolean = false;
  constructor(config: PlayerType) {
    const {scene, x, y} = config;
    super(scene, x, y, "box");

    scene.physics.world.enableBody(this);
    scene.add.existing(this)
    this.displayWidth = 27
    this.displayHeight = 27
    this.isHitBoundaries = false
    
    // if('setSize' in this.body) {
    //   this.body.setSize(51,51, true)
    // }
    // this.setScale(.2)
    this.setDepth(2)
    this.setParticle()
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

  handleAutoMove(x:number,y:number) {
    this.setPosition(x, y)
  }

  setParticle() {
    let emmiter:any;
    let particles:any;
    if(emmiter) {
      emmiter.stop()
      // particles.destroy()
    }
  
    particles = this.scene.add.particles("red");
    emmiter = particles.createEmitter({
      speed: 10,
      scale: { start: .2, end: 0 },
      blendMode: "ADD"
    });
    emmiter.startFollow(this);
  
    // this.scene.time.delayedCall(1000, function() {
    //   emmiter.stop()
    // });
  }

  update(time: number, delta: number, callback:Function): void {
    const {keys} = gameConfig
    
    if('setVelocity' in this.body) {
    // this.body.setVelocity(0,0)
    if(keys.a.isDown) {
        // this.body.setVelocity(-150, 0)
        this.body.setVelocityX(-200)
        callback()
      }
      if(keys.d.isDown) {
        // this.body.setVelocity(200, 0)
        this.body.setVelocityX(200)
        callback()
      }
      if(keys.w.isDown) {
        // this.body.setVelocity(0, -200)
        this.body.setVelocityY(-200)
        callback()
      }
      if(keys.s.isDown) {
        // this.body.setVelocity(0, 200)
        this.body.setVelocityY(200)
        callback()
      }
    }
  }
}

export default Player;