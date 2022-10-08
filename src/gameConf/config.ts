import Phaser from 'phaser';
import { GameConfigType } from '../Utility/type';

const gameOptions = {
  mazeWidth: 21,
  mazeHeight: 31,
  tileSize: 10
}

const gameConfig: GameConfigType = {
  keys: {},
  planeSpeed: 1000
}

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  width: gameOptions.mazeWidth * gameOptions.tileSize,
  height: gameOptions.mazeHeight * gameOptions.tileSize,
  scale: {
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: false
    }
  },
};

export {gameOptions, gameConfig}