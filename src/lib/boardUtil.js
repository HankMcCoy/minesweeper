/**
 * Returns a two-dimensional array of cells, each of which knows whether there
 * is a bomb in it, whether it's revealed yet, and how many bombs are adjacent.
 */
export function getBoard(numRows, numCols, numBombs) {
  var board = new Array(numCols);
  var bombCoords = getRandomBombs(numRows, numCols, numBombs);

  for (let x = 0; x < board.length; x++) {
    board[x] = new Array(numRows);

    for (let y = 0; y < board[x].length; y++) {
      board[x][y] = {
        isBomb: bombCoords.has(getKey(x, y)),
        isRevealed: false,
        adjacentBombs: getAdjacencies(x, y)
          .filter((neighX, neighY) => bombCoords.has(getKey(neighX, neighY)))
          .length
      };
    }
  }

  return board;
}

export function revealCell(board, x, y) {
  return board.setIn([y, x, 'isRevealed'], true);
}

/**
 * Returns a set of random coordinate strings.
 */
function getRandomBombs(numRows, numCols, numBombs) {
  var bombCoords = new Set();

  function getRandInt(max) {
    return Math.floor(Math.random() * max);
  }

  while (bombCoords.size < numBombs)
    bombCoords.add(getKey(getRandInt(numCols), getRandInt(numRows)));

  return bombCoords;
}

function getKey(x, y) {
  return x + ',' + y;
}

/**
 * Get a list of coordinates adjacent to those supplied.
 *
 * Example: getAdjacencies(10, 18)
 *   returns [[9, 17], [9, 18], [9, 19], ...]
 */
function getAdjacencies(x, y) {
  return [-1, 0, 1]
    .map(dx =>
      [-1, 0, 1]
        .filter(dy => dx !== 0 || dy !== 0)
        .map(dy => ({ x: x + dx, y: y + dy }))
    );
}

