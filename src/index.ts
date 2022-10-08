import Phaser from 'phaser';
import config from './gameConf/config';
import GameScene from './scenes/Game';

let game: any;
game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene]
  })
);

export default game;

window.focus()
resize();
window.addEventListener("resize", resize, false);
function resize() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if(windowRatio < gameRatio){
      canvas!.style.width = windowWidth + "px";
      canvas!.style.height = (windowWidth / gameRatio) + "px";
  }
  else{
      canvas!.style.width = (windowHeight * gameRatio) + "px";
      canvas!.style.height = windowHeight + "px";
  }
}