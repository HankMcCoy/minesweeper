import React from 'react';
import Board from './board';
import { getBoard, revealCell } from '../lib/boardUtil';

const NUM_ROWS = 16;
const NUM_COLS = 16;
const NUM_MINES = 30;

var Minesweeper = React.createClass({
  getInitialState() {
    return {
      isFreshGame: true,
      board: getBoard(NUM_ROWS, NUM_COLS, 0)
    };
  },
  render() {
    return (
      <div className="minesweeper">
        <Board board={this.state.board} onCellClick={this.handleCellClick} />
      </div>
    );
  },
  handleCellClick(x, y) {
    var board;

    // If this is the first turn, generate the board until we get one that
    // has a not bomb-neighboring cell at the click location.
    if (this.state.isFreshGame) {
      do {
        board = getBoard(NUM_ROWS, NUM_COLS, NUM_MINES);
      } while(!(board[x][y].adjacentBombs === 0 && board[x][y].isBomb === false));
    }
    else {
      board = this.state.board;
    }

    this.setState({
      isFreshGame: false,
      board: revealCell(board, x, y)
    });
  }
});

export default Minesweeper;

