import Phaser from 'phaser';
import EasyStar from 'easystarjs';
import { gameConfig, gameOptions } from '../gameConf/config';
import { PathType } from '../Utility/type';
import game from '..';
import Player from '../objects/player';



export default class GameScene extends Phaser.Scene {
  mazeGraphics:any;
  maze:any;
  mazeIntersection:Array<Array<Boolean>>;
  player:Player | null;
  constructor() {
    super('GameScene');
    this.mazeGraphics = null;
    this.maze= [];
    this.player=null;
    this.mazeIntersection = [];
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('flappy-yellow', 'assets/flappy-yellow.png');
  }

  create(){
    this.mazeGraphics = this.add.graphics();
    var moves = [];
    this.maze = [];
    for(var i = 0; i < gameOptions.mazeHeight; i ++){
      this.maze[i] = [];
      for(var j = 0; j < gameOptions.mazeWidth; j ++){
        this.maze[i][j] = 1;
      }
    }
    var posX = 1;
    var posY = 1;
    this.maze[posX][posY] = 0;
    moves.push(posY + posY * gameOptions.mazeWidth);
    
    while(moves.length){
        var possibleDirections = "";
        if(posX+2 > 0 && posX + 2 < gameOptions.mazeHeight - 1 && this.maze[posX + 2][posY] == 1){
          // console.log("bawah")
          possibleDirections += "S";
        }
        if(posX-2 > 0 && posX - 2 < gameOptions.mazeHeight - 1 && this.maze[posX - 2][posY] == 1){
          // console.log("atas")
          possibleDirections += "N";
        }
        if(posY-2 > 0 && posY - 2 < gameOptions.mazeWidth - 1 && this.maze[posX][posY - 2] == 1){
          // console.log("kiri")
          possibleDirections += "W";
        }
        if(posY+2 > 0 && posY + 2 < gameOptions.mazeWidth - 1 && this.maze[posX][posY + 2] == 1){
          // console.log("kanan")
          possibleDirections += "E";
        }
        if(possibleDirections){
          var move = Phaser.Math.Between(0, possibleDirections.length - 1);
          switch (possibleDirections[move]){
            case "N":
              this.maze[posX - 2][posY] = 0;
              this.maze[posX - 1][posY] = 0;
              posX -= 2;
              break;
            case "S":
              this.maze[posX + 2][posY] = 0;
              this.maze[posX + 1][posY] = 0;
              posX += 2;
              break;
            case "W":
              this.maze[posX][posY - 2] = 0;
              this.maze[posX][posY - 1] = 0;
              posY -= 2;
              break;
            case "E":
              this.maze[posX][posY + 2] = 0;
              this.maze[posX][posY + 1] = 0;
              posY += 2;
              break;
            }
          moves.push(posY + posX * gameOptions.mazeWidth);
        }
        else{
          var back = moves.pop();
          posX = Math.floor(back! / gameOptions.mazeWidth);
          posY = back! % gameOptions.mazeWidth;
        }
    }

    this.mazeIntersection = this.maze.map((arr: number[], indexArr: number) => {
      var prevArr = this.maze[indexArr - 1] ?? [];
      var nextArr = this.maze[indexArr + 1] ?? [];

      return arr.map((arrItem: number, indexArrItem: number) => {
        var isIntersection = false;

        if(indexArrItem > 0 && indexArrItem < arr.length - 1) {
          var numPath = 0;

          if((arr[indexArrItem - 1] ?? 1) == 0) {
            numPath += 1;
          }
          if((arr[indexArrItem + 1] ?? 1) == 0) {
            numPath += 1;
          }
          if ((nextArr[indexArrItem] ?? 1) == 0) {
            numPath += 1;
          }
          if ((prevArr[indexArrItem] ?? 1) == 0) {
            numPath += 1;
          }

          if(arrItem == 0 && numPath == 3) {
            // console.log("Intersection Found!", indexArr, indexArrItem)
            isIntersection = true;
          }
        }

        if (isIntersection) {
          return true;
        }
  
        return false;
      });
    });

    var easystar = new EasyStar.js();
    const self = this
    easystar.setGrid(this.maze);
    easystar.setAcceptableTiles([0]);
    easystar.findPath(1, 1, gameOptions.mazeWidth - 2, gameOptions.mazeHeight - 2, function(path:Array<PathType>){
      self.player = new Player({
        scene:self,
        x: path[path.length-1].x * gameOptions.tileSize + 15,
        y: path[path.length-1].y * gameOptions.tileSize + 15
      })
      self.drawMaze(posX, posY)
      // self.drawPath(path, self.player);
    }.bind(this));
    easystar.calculate();

    const {keys} = gameConfig
    keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keys.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keys.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keys.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 
  }

  drawMaze(posX:number, posY:number){
    this.mazeGraphics.fillStyle(0x000000);
    for(var i = 0; i < gameOptions.mazeHeight; i ++){
      for(var j = 0; j < gameOptions.mazeWidth; j ++){
        if(this.maze[i][j] == 1){
          let mazeWall = this.add.rectangle(
            j * gameOptions.tileSize + 15, 
            i * gameOptions.tileSize + 15, 
            gameOptions.tileSize, 
            gameOptions.tileSize,
            0x000000
          );         
          this.physics.add.existing(mazeWall);

          if('setVelocity' in mazeWall.body) {
            mazeWall.body.setCollideWorldBounds(true);
            mazeWall.body.setImmovable(true)
          }

          this.physics.add.collider(this.player!, mazeWall, (player, wallobj) => {
            this.player?.handleCollide(wallobj)
          })
            
        } else {
          if(this.mazeIntersection[i][j]) {
            let txt = this.add.text(j * gameOptions.tileSize + 10, i * gameOptions.tileSize + 10, `${j}`, { color: '#FFFFFF' });
            txt.setDepth(1)
            let intersection = this.add.rectangle(
              j * gameOptions.tileSize + 15, 
              i * gameOptions.tileSize + 15, 
              gameOptions.tileSize - 10, 
              gameOptions.tileSize - 10,
              0xFF0000
            ) as any

            this.physics.add.existing(intersection);
            this.player!.isHitBoundaries = false

            if('setVelocity' in intersection.body) {
              intersection.body.setCollideWorldBounds(true);
              intersection.body.setImmovable(true)
            }

            this.physics.add.overlap(this.player! , intersection, (player, intersectionObj) => {
              // this.player?.handleCollide(wallobj)
              // console.log(player.body.y)
              if(this.player!.isHitBoundaries === false) {
                this.physics.moveToObject(this.player!, intersectionObj, 80, 80)
                // setTimeout(() => {
                //   player!.isHitBoundaries = true
                // }, 200);
                // setTimeout(() => {
                //   console.log("wkwkwk")
                //   // player.body.setImmovable(false)
                //   player.body.setVelocity(0, 0)
                // }, 1000);
              }  
              // if(Math.ceil(player.body.y)+10 > intersectionObj.body.y || Math.ceil(player.body.x)+10 > intersectionObj.body.x) {
              //   console.log("lebih")
              // }
              
              // this.player?.handleAutoMove(wallobj.body.y, wallobj.body.x)
            })
          }
          // this.add.rectangle(
          //   j * gameOptions.tileSize + 15, 
          //   i * gameOptions.tileSize + 15, 
          //   gameOptions.tileSize - 10, 
          //   gameOptions.tileSize - 10,
          //   0xFFFFFF
          // ) 
        }
      }
    }
  }

  drawPath(path:Array<PathType>, player:any){
    var i = path.length-1;
    const self = this
    this.time.addEvent({
      delay: 5,
      callback: function(){
        if(i > -1){
          self.mazeGraphics.fillStyle(0x00FFDD);
          self.add.rectangle(
            path[i].x * gameOptions.tileSize + 15, 
            path[i].y * gameOptions.tileSize + 15, 
            gameOptions.tileSize, 
            gameOptions.tileSize,
            0x00FFDD
          );
          
          // self.player?.handleAutoMove(path[i].x * gameOptions.tileSize + 15, path[i].y * gameOptions.tileSize + 15)
          i--;
        }
        else{
          // self.scene.start("GameScene");
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  update(time: number, delta: number): void {
    this.player?.update(time, delta);
  }
}
