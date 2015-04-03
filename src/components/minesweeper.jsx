import classNames from 'classnames';
import Immutable from 'immutable';
import React from 'react';
import { getBoard, revealCell } from '../lib/boardUtil';

const NUM_ROWS = 16;
const NUM_COLS = 16;
const NUM_MINES = 30;

var Minesweeper = React.createClass({
  getInitialState() {
    return {
      isFreshGame: true,
      board: Immutable.fromJS(getBoard(NUM_ROWS, NUM_COLS, NUM_MINES))
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
    this.setState({
      board: revealCell(this.state.board, x, y)
    });
  }
});

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

var Cell = React.createClass({
  render() {
    var cell = this.props.cell;
    var isRevealed = cell.get('isRevealed');
    var adjacentBombs = cell.get('adjacentBombs');
    var isBomb = cell.get('isBomb');

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
    '3': 'a3a'
  };

  return numBombs <= 3 ? adjColors[numBombs] : '#337';
}

export default Minesweeper;

