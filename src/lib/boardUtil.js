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
        adjacentBombs: getAdjacencies({x, y})
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
  var startCell = board.getIn([x, y]);

  if (startCell.get('isBomb')) {
    // Reveal all bombs
    exploredKeys = getAllBombKeys(board);
  }
  else if (startCell.get('adjacentBombs') > 0) {
    // Reveal just this cell
    exploredKeys.add(getCellKey({x, y}));
  }
  else {
    // Reveal all cells devoice of bombs with a path to this cell and their
    // adjacent cells.
    exploredKeys = getClearCellsAndAdjacencies(board, x, y);
  }

  for (let key of exploredKeys) {
    let coord = getCoordFromKey(key);

    board = board.setIn([coord.x, coord.y, 'isRevealed'], true);
  }

  return board;
}

function getClearCellsAndAdjacencies(board, x, y) {
  var edgeKeys = new Set(getAdjacencies({x, y}).map(getCellKey));
  var nextEdgeKeys = new Set();
  var exploredKeys = new Set([
    getCellKey({x, y}),
    ...edgeKeys
  ]);

  while (edgeKeys.size) {
    edgeKeys.forEach(function (edgeKey) {
      getAdjacencies(getCoordFromKey(edgeKey))
        .forEach(function (coord) {
          var key = getCellKey(coord);

          if (!exploredKeys.has(key)) {
            exploredKeys.add(key);

            if (board.getIn([coord.x, coord.y, 'adjacentBombs']) === 0)
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
      .toArray()
      .map((col, x) => {
        return col
          .toArray()
          .map((cell, y) => cell.get('isBomb') ? getCellKey({x, y}) : null)
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
 *   returns [{x: 9, y: 17}, {x: 9, y: 18}, {x: 9, y:19}, ...]
 */
function getAdjacencies(coord) {
  return [-1, 0, 1]
    .map(dx =>
      [-1, 0, 1]
        // Don't include the original coordinate.
        .filter(dy => dx !== 0 || dy !== 0)
        .map(dy => ({
          x: coord.x + dx,
          y: coord.y + dy
        }))
    )
    .reduce((result, arr) => result.concat(arr), [])
}

