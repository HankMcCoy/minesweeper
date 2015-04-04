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
      board: getBoard(NUM_ROWS, NUM_COLS, NUM_MINES)
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
    this.setState((prevState) => {
      board: revealCell(prevState.board, x, y)
    });
  }
});

export default Minesweeper;

