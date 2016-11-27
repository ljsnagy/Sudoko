import Zepto from 'zepto';
import GameGrid from './gameGrid.js';

Zepto(function load() {
  var grid = new GameGrid(document.getElementById('game-grid'));
});

