/**
 * Returns a two-dimensional array of cells, each of which knows whether there
 * is a bomb in it, whether it's revealed yet, and how many bombs are adjacent.
 */
export function getBoard(numRows, numCols, numBombs) {
  var board = new Array(numCols);
  var bombCoords = getRandomBombs(numRows, numCols, numBombs);

  for (let x = 0; x < numCols; x++) {
    board[x] = new Array(numRows);

    for (let y = 0; y < numRows; y++) {
      board[x][y] = {
        isBomb: bombCoords.has(getCellKey({x, y})),
        isRevealed: false,
        adjacentBombs: getNeighbors({x, y}, {numRows, numCols})
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
  var exploredKeys = new Set();
  var startCell = board[x][y];

  if (startCell.isBomb) {
    // Reveal all bombs
    exploredKeys = getAllBombKeys(board);
  }
  else if (startCell.adjacentBombs > 0) {
    // Reveal just this cell
    exploredKeys.add(getCellKey({x, y}));
  }
  else {
    // Reveal all cells devoid of bombs with a path to this cell and their
    // adjacent cells.
    exploredKeys = getClearCellsAndNeighbors(board, x, y);
  }

  for (let key of exploredKeys) {
    let coord = getCoordFromKey(key);

    board[coord.x][coord.y].isRevealed = true;
  }

  return board;
}

function getClearCellsAndNeighbors(board, x, y) {
  var boardSize = {
    numCols: board.length,
    numRows: board[0].length
  };
  var startKey = getCellKey({x, y});
  var edgeKeys = new Set([startKey]);
  var nextEdgeKeys = new Set();
  var exploredKeys = new Set([startKey]);

  while (edgeKeys.size) {
    edgeKeys.forEach(function (edgeKey) {
      getNeighbors(getCoordFromKey(edgeKey), boardSize)
        .forEach(function (coord) {
          var key = getCellKey(coord);
          var cell = board[coord.x][coord.y];

          if (!exploredKeys.has(key)) {
            exploredKeys.add(key);

            if (cell.adjacentBombs === 0)
              nextEdgeKeys.add(key)
          }
        });
    });

    [edgeKeys, nextEdgeKeys] = [nextEdgeKeys, new Set()];
  }

  return exploredKeys;
}

function getAllBombKeys(board) {
  return new Set(
    board
      .map((col, x) => {
        return col
          .map((cell, y) => cell.isBomb ? getCellKey({x, y}) : null)
          .filter(key => key !== null)
       })
      .reduce((result, arr) => result.concat(arr), [])
  );
}

function getCellKey(coord) {
  return coord.x + ',' + coord.y;
}

function getCoordFromKey(cellKey) {
  var [x, y] = cellKey.split(',').map(str => parseInt(str, 10));

  return { x, y };
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
    bombCoords.add(getCellKey({ x: getRandInt(numCols), y: getRandInt(numRows)}));

  return bombCoords;
}

/**
 * Get a list of coordinates adjacent to those supplied.
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
          return coord.x >= 0 && coord.x < boardSize.numCols &&
            coord.y >= 0 && coord.y < boardSize.numRows;
        })
    )
    .reduce((result, arr) => result.concat(arr), [])
}

