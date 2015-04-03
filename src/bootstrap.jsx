// Polyfill ES5/6 methods.
require('core-js/shim');

import React from 'react';
import Minesweeper from './components/minesweeper';

[].forEach.call(document.querySelectorAll('.minesweeper-container'), (el) => {
  React.render(<Minesweeper />, el);
});
