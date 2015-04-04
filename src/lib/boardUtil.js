/**
 * Returns a two-dimensional array of cells, each of which knows whether there
 * is a bomb in it, whether it's revealed yet, and how many bombs are adjacent.
 */
export function getBoard(width, height, numBombs) {
  var board = new Array(width);
  var bombCoords = new Set(getRandomBombs(width, height, numBombs));

  for (let x = 0; x < width; x++) {
    board[x] = new Array(height);

    for (let y = 0; y < height; y++) {
      board[x][y] = {
        isBomb: bombCoords.has(getCellKey({x, y})),
        isRevealed: false,
        adjacentBombs: getNeighbors({x, y}, {height, width})
          .filter((adj) => bombCoords.has(getCellKey(adj)))
          .length
      };
    }
  }

  return board;
}

/**
 * Return a board with the correct cells revealed from a click on x, y.
 */
export function revealCell(board, x, y) {
  var startCell = board[x][y];

  // If this cell is adjacent to bombs or is a bomb, only reveal it.
  if (startCell.adjacentBombs > 0 || startCell.isBomb) {
    board[x][y].isRevealed = true;
  }
  // Otherwise reveal all cells devoid of bombs with a path to this
  // cell and their adjacent cells.
  else {
    getClearCellsAndNeighbors(board, x, y)
      .map(getCoordFromKey)
      .forEach(coord => { board[coord.x][coord.y].isRevealed = true; })
  }

  return board;
}

/**
 * Return true if the user has revealed all cells except for those
 * holding bombs.
 */
export function hasWon(board) {
  var width = board.length;
  var height = board[0].length;
  var revealedKeys = board
    .map((col, x) => {
      return col
        .map((cell, y) => cell.isRevealed ? getCellKey({x, y}) : null)
        .filter(key => key !== null)
    })
    .reduce((result, arr) => result.concat(arr), []);
  var revealedAndBombKeys = new Set(revealedKeys.concat(getAllBombKeys(board)));

  return revealedAndBombKeys.size === width*height;
}

/**
 * Returns an array of keys of all cells that can be reached from the
 * inital cell without  through a cell that neighbors a bomb.
 */
function getClearCellsAndNeighbors(board, x, y) {
  var boardSize = {
    width: board.length,
    height: board[0].length
  };
  var startKey = getCellKey({x, y});
  var edgeKeys = [startKey];
  var nextEdgeKeys = [];
  var exploredKeys = {[startKey]: true};

  while (edgeKeys.length) {
    edgeKeys.forEach(function (edgeKey) {
      getNeighbors(getCoordFromKey(edgeKey), boardSize)
        .forEach(function (coord) {
          var key = getCellKey(coord);
          var cell = board[coord.x][coord.y];

          if (!exploredKeys[key]) {
            exploredKeys[key] = true;

            if (cell.adjacentBombs === 0)
              nextEdgeKeys.push(key);
          }
        });
    });

    [edgeKeys, nextEdgeKeys] = [nextEdgeKeys, []];
  }

  return Object.keys(exploredKeys);
}

/**
 * Returns an array of keys of cells that contain bombs.
 */
function getAllBombKeys(board) {
  return board
    .map((col, x) => {
      return col
        .map((cell, y) => cell.isBomb ? getCellKey({x, y}) : null)
        .filter(key => key !== null)
     })
    .reduce((result, arr) => result.concat(arr), [])
}

/**
 * Converts an {x,y} coordinate into a string of the form 'x,y'.
 *
 * This is helpful when we want to do a simple value comparison to see
 * if two coordinates are equivalent.
 *
 * E.g. while {x:2, y:3} is not strictly equal to {x:2, y: 3}, '2,3' is
 * strictly equal to '2,3'.
 */
function getCellKey(coord) {
  return coord.x + ',' + coord.y;
}

/**
 * Converts a coordinate key of the form 'x,y' to an object {x,y}.
 */
function getCoordFromKey(cellKey) {
  var [x, y] = cellKey.split(',').map(str => parseInt(str, 10));

  return { x, y };
}

/**
 * Returns an array  of random coordinate strings.
 */
function getRandomBombs(width, height, numBombs) {
  var bombCoords = {};
  var key;

  function getRandInt(max) {
    return Math.floor(Math.random() * max);
  }

  while (Object.keys(bombCoords).length < numBombs) {
    key = getCellKey({
      x: getRandInt(width),
      y: getRandInt(height)
    });

    bombCoords[key] = true;
  }

  return Object.keys(bombCoords);
}

/**
 * Get an array of coordinates adjacent to the given coordinate.
 *
 * Example: getNeighbors(10, 18)
 *   returns [{x: 9, y: 17}, {x: 9, y: 18}, {x: 9, y:19}, ...]
 */
function getNeighbors(coord, boardSize) {
  return [-1, 0, 1]
    .map(dx =>
      [-1, 0, 1]
        // Don't include the original coordinate.
        .filter(dy => dx !== 0 || dy !== 0)
        .map(dy => ({
          x: coord.x + dx,
          y: coord.y + dy
        }))
        // Don't allow coordinates beyond the edges of the board.
        .filter(coord => {
          return coord.x >= 0 && coord.x < boardSize.width &&
            coord.y >= 0 && coord.y < boardSize.height;
        })
    )
    .reduce((result, arr) => result.concat(arr), [])
}

