import React from 'react';
import Cell from './cell';

var Board = React.createClass({
  render() {
    var rows = this.props.board
      .toArray()
      .map((row, y) => {
        var cells = row
          .toArray()
          .map((cell, x) =>
            <Cell cell={cell} key={x}
              onClick={this.props.onCellClick.bind(null, x, y)} />);

        return <div className="minesweeper__row" key={y}>{cells}</div>;
      });

    return (
      <div className="minesweeper__board">
        {rows}
      </div>
    );
  }
});

export default Board;
