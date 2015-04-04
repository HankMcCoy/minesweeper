import React from 'react';
import Board from './board';
import GAME_STATE from '../lib/gameState';
import {
  getBoard,
  revealCell,
  hasWon
} from '../lib/boardUtil';

const NUM_ROWS = 16;
const NUM_COLS = 16;
const NUM_MINES = 30;

var Minesweeper = React.createClass({
  getInitialState() {
    return {
      gameState: GAME_STATE.NEW_GAME,
      board: getBoard(NUM_COLS, NUM_ROWS, 0)
    };
  },
  render() {
    return (
      <div className="minesweeper">
        <h2 className="minesweeper__heading">Game of Mines</h2>
        <Board
          board={this.state.board}
          gameState={this.state.gameState}
          onCellClick={this.handleCellClick} />
        <div className="minesweeper__controls">
          <button
            className="minesweeper__new-game"
            onClick={this.newGame}>
            New game
          </button>
        </div>
      </div>
    );
  },
  handleCellClick(x, y) {
    var board = this.state.board;
    var gameState = this.state.gameState;

    // If this is the first turn, generate the board until we get one that
    // has a not bomb-neighboring cell at the click location.
    if (this.state.gameState === GAME_STATE.NEW_GAME) {
      gameState = GAME_STATE.PLAYING;

      do {
        board = getBoard(NUM_COLS, NUM_ROWS, NUM_MINES);
      } while(!(board[x][y].adjacentBombs === 0 && board[x][y].isBomb === false));
    }

    if (gameState === GAME_STATE.PLAYING) {
      board = revealCell(board, x, y);

      if (board[x][y].isBomb)
        gameState = GAME_STATE.LOST;
      else if (hasWon(board))
        gameState = GAME_STATE.WON;
    }

    this.setState({
      gameState: gameState,
      board: board
    });
  },
  newGame() {
    this.setState({
      gameState: GAME_STATE.NEW_GAME,
      board: getBoard(NUM_COLS, NUM_ROWS, 0)
    });
  }
});

export default Minesweeper;

