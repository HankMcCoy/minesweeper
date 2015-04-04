import React from 'react';
import Cell from './cell';

var Board = React.createClass({
  render() {
    var cols = this.props.board
      .toArray()
      .map((col, x) => {
        var cells = col
          .toArray()
          .map((cell, y) =>
            <Cell cell={cell} key={y}
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
