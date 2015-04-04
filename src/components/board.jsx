import React from 'react';
import Cell from './cell';

var Board = React.createClass({
  render() {
    var cols = this.props.board
      .map((col, x) => {
        var cells = col
          .map((cell, y) =>
            <Cell
              cell={cell}
              gameState={this.props.gameState}
              key={y}
              onClick={this.props.onCellClick.bind(null, x, y)} />);

        return <div className="minesweeper__col" key={x}>{cells}</div>;
      });

    return (
      <div className="minesweeper__board">
        {cols}
      </div>
    );
  }
});

export default Board;
