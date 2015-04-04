import React from 'react';
import Cell from './cell';

var Board = React.createClass({
  render() {
    var rows = [];
    var board = this.props.board;

    for (let y = 0; y < board.height; y++) {
      let cells = [];

      for (let x = 0; x < board.width; x++) {
        let idx = y*board.width + x;

        cells.push(
          <Cell
            cell={board.cells[idx]}
            gameState={this.props.gameState}
            key={x}
            onClick={this.props.onCellClick.bind(null, idx)} />
        );
      }

      rows.push(
        <div className="minesweeper__row" key={y}>
          {cells}
        </div>
      );
    }

    return (
      <div className="minesweeper__board">
        {rows}
      </div>
    );
  }
});

export default Board;
