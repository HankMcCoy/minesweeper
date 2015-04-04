/**
 * Returns a two-dimensional array of cells, each of which knows whether there
 * is a bomb in it, whether it's revealed yet, and how many bombs are adjacent.
 */
export function getBoard(width, height, numBombs) {
  var cells = new Array(width*height);
  var bombIndices = getRandomBombs(width, height, numBombs);

  for (let idx = 0; idx < width*height; idx++) {
    cells[idx] = {
      isBomb: bombIndices.indexOf(idx) !== -1,
      isRevealed: false,
      adjacentBombs: getNeighbors(idx, {width, height})
        .filter(idx => bombIndices.indexOf(idx) !== -1)
        .length
    };
  }

  return {cells, width, height, bombIndices};
}

/**
 * Reveal all cells that should be revealed by a click on the given
 * cell.
 *
 * Mutates board in place.
 */
export function revealCell(board, startIdx) {
  var startCell = board.cells[startIdx];

  // If this cell is adjacent to bombs or is a bomb, only reveal it.
  if (startCell.adjacentBombs > 0 || startCell.isBomb) {
    startCell.isRevealed = true;
  }
  // Otherwise reveal all cells devoid of bombs with a path to this
  // cell and their adjacent cells.
  else {
    getClearCellsAndNeighbors(board, startIdx)
      .forEach(idx => { board.cells[idx].isRevealed = true; })
  }
}

/**
 * Return true if the user has revealed all cells except for those
 * holding bombs.
 */
export function hasWon(board) {
  var revealedIndices = board.cells
    .map((cell, idx) => cell.isRevealed ? idx : null)
    .filter(idx => idx !== null)
  var revealedAndBombIndices = revealedIndices.concat(board.bombIndices);

  return revealedAndBombIndices.length === board.width*board.height;
}

/**
 * Returns an array of indices of all cells that can be reached from the
 * inital cell without passing through a cell that neighbors a bomb.
 */
function getClearCellsAndNeighbors(board, startIdx) {
  var edgeIndices = [startIdx];
  var nextEdgeIndices = [];
  var exploredIndices = {[startIdx]: true};

  while (edgeIndices.length) {
    edgeIndices.forEach(function (edgeIdx) {
      getNeighbors(edgeIdx, board)
        .forEach(function (neighborIdx) {
          var cell = board.cells[neighborIdx];

          if (!exploredIndices[neighborIdx]) {
            exploredIndices[neighborIdx] = true;

            if (cell.adjacentBombs === 0)
              nextEdgeIndices.push(neighborIdx);
          }
        });
    });

    [edgeIndices, nextEdgeIndices] = [nextEdgeIndices, []];
  }

  return Object.keys(exploredIndices).map(idx => parseInt(idx, 10));
}

/**
 * Returns an array  of random coordinate strings.
 */
function getRandomBombs(width, height, numBombs) {
  var bombIndices = {};
  var idx;

  while (Object.keys(bombIndices).length < numBombs) {
    idx = Math.floor(Math.random() * width * height);

    bombIndices[idx] = true;
  }

  return Object.keys(bombIndices).map(idx => parseInt(idx, 10));
}

function getCoord(idx, boardSize) {
  return {
    x: idx % boardSize.width,
    y: Math.floor(idx/boardSize.width)
  };
}

/**
 * Get an array of indices adjacent to the given index.
 */
function getNeighbors(startIdx, boardSize) {
  var {x, y} = getCoord(startIdx, boardSize);

  function getDiffArr(pos, size) {
    return [
      pos > 0 && -1,
      0,
      pos < size - 1 && 1
    ].filter(x => x !== false);
  }

  return getDiffArr(x, boardSize.width)
    .map(dx =>
      getDiffArr(y, boardSize.height)
        // Don't include the original coordinate.
        .filter(dy => dx !== 0 || dy !== 0)
        .map(dy => startIdx + dy*boardSize.width + dx)
        // Don't allow coordinates beyond the edges of the board.
        .filter(idx => idx >= 0 && idx < boardSize.width*boardSize.height)
    )
    .reduce((result, arr) => result.concat(arr), [])
}

