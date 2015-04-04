import classNames from 'classnames';
import React from 'react';

var Cell = React.createClass({
  render() {
    var cell = this.props.cell;
    var isBomb = cell.isBomb;
    var isRevealed = cell.isRevealed;
    var adjacentBombs = cell.adjacentBombs;

    return (
      <div className={
          classNames(
            'minesweeper__cell',
            {'minesweeper__cell--bomb': isBomb && isRevealed},
            {'minesweeper__cell--revealed': !isBomb && isRevealed}
          )
        }
        style={{color: getAdjColor(adjacentBombs)}}
        onClick={this.props.onClick}>
        {!isBomb && isRevealed && adjacentBombs ? adjacentBombs : ''}
      </div>
    );
  }
});

function getAdjColor(numBombs) {
  var adjColors = {
    '1': '#33a',
    '2': '#3a3',
    '3': '#a3a'
  };

  return numBombs <= 3 ? adjColors[numBombs] : '#337';
}

export default Cell;
