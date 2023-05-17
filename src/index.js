import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// 判断是否获胜
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winnerList: lines[i],
      };
    }
  }
  return null;
}

// 一维数组转换伪二维数组
function arrChange(num, arr) {
  const newArr = [];
  while (arr.length > 0) {
    newArr.push(arr.splice(0, num));
  }
  return newArr;
}

// 生成方块的函数式方法
function Square(props) {
  return (
    <button className={`square ${props.className}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(r, l, i) {
    return (
      <Square
        value={this.props.squares[i]}
        className={this.props?.winners?.includes(i) ? "highlight" : ""}
        onClick={() => this.props.onClick(r, l, i)}
      />
    );
  }

  render() {
    const newArr = arrChange(this.props.row, [...this.props.squares]);
    return (
      <div>
        {newArr.map((square, index) => {
          return (
            <div className="board-row" key={index}>
              {square.map((sq, i) => (
                <span key={i + this.props.row * index}>
                  {this.renderSquare(index, i, i + this.props.row * index)}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      row: 3,
      order: "desc",
    };
  }
  handleClick(r, l, i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: r,
          line: l,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  resetArr(order) {
    const history = this.state.history;
    this.setState({
      history: history.reverse(),
      order,
    });
  }

  renderDesc(step, move, length) {
    let desc = "";
    if (this.state.order === "desc") {
      desc = move
        ? `Go to move #${move},row: ${step.row + 1},line:${step.line + 1}`
        : "Go to game start";
      return desc;
    } else {
      desc =
        move === length - 1
          ? "Go to game start"
          : `Go to move #${move},row: ${step.row + 1},line:${step.line + 1}`;
      return desc;
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = this.renderDesc(step, move, history.length);
      return (
        <li
          key={move}
          className={move === this.state.stepNumber ? "weight" : ""}
        >
          {move === this.state.stepNumber}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      if (history.length >= 9) {
        status = "X and O draw";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            row={3}
            squares={current.squares}
            winners={winner?.winnerList}
            onClick={(r, l, i) => this.handleClick(r, l, i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="order">
            <div
              onClick={() => this.resetArr("arc")}
              className={this.state.order === "arc" ? "arc" : ""}
            >
              ↑
            </div>
            <div
              onClick={() => this.resetArr("desc")}
              className={this.state.order === "desc" ? "desc" : ""}
            >
              ↓
            </div>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
