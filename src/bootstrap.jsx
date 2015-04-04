// Polyfill ES5/6 methods.
require('core-js/shim');

import React from 'react';
import Minesweeper from './components/minesweeper';

[].forEach.call(document.querySelectorAll('.minesweeper-container'), (el) => {
  React.render(<Minesweeper />, el);
});

var linkTag = document.createElement('link');
linkTag.rel = 'stylesheet';
linkTag.href = window.isMinesweeperLocal ? 'style.css' : 'https://raw.githack.com/HankMcCoy/minesweeper/master/style.css';
document.getElementsByTagName('head')[0].appendChild(linkTag);
