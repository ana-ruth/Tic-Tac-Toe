function Gameboard() 
{
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    //check cell to mark it
    const markPlace = (row,column,player) => {

        const selectedCell = board[row][column];

        //If cell is already marked, don't change of turn, keep the same player to pick a different cell
        if(selectedCell.getValue() != 0 )
            {
                switchPlayerTurn();
                return;
            } 
    
        const markedCell = selectedCell.addMark(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell => cell.getValue())))
        console.log(boardWithCellValues);
    };

    return { getBoard, markPlace, printBoard };
}


function Cell()
{
    let value = 0;

    const addMark = (player) => {
        value = player;
    }
    
    const getValue = () => value;

    return{
        addMark,
        getValue
    };
}

function GameController( playerOneName = "Player One", playerTwoName = "Player Two")
{
    const board = Gameboard();
    
    const players = [
        {
            name: playerOneName, mark: "X"
        },
        {
            name: playerTwoName, mark: "O"
        }
    ];

    let gameEndStatus = false;

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    
    const playRound = (row,column) => {
        
        const boardGame = board.getBoard();

        //check for three in a row win
        for(let i = 0; i < 3; i++) {
            const cell1 = boardGame[i][0].getValue();
            const cell2 = boardGame[i][1].getValue();
            const cell3 = boardGame[i][2].getValue();
            if((cell1 !=0) && cell1 === cell2 && cell2=== cell3) {
                console.log( "winner");
                gameEndStatus = true;
                return;
            }

        }

        //check for three in a column win
        for(let i = 0; i < 3; i++) {
            const cell1 = boardGame[0][i].getValue();
            const cell2 = boardGame[1][i].getValue();
            const cell3 = boardGame[2][i].getValue();
            if((cell1 !=0) && cell1 === cell2 && cell2=== cell3) {
                console.log( "winner");
                gameEndStatus = true;
                return;
            }
        }

        // check for  three in diagonal( \ ) win
        if(boardGame[0][0].getValue()!=0 && boardGame[0][0].getValue() == boardGame[1][1].getValue() && boardGame[1][1].getValue() == boardGame[2][2].getValue()){
            console.log( "winner");
            gameEndStatus = true;
            return;
        }

        // check for  three in diagonal( / ) win
        if(boardGame[0][2].getValue()!=0 && boardGame[0][2].getValue() == boardGame[1][1].getValue() && boardGame[1][1].getValue() == boardGame[2][0].getValue()){
            console.log( "winner");
            gameEndStatus = true;
            return;
        }


    console.log(`Marking ${getActivePlayer().name}'s ${getActivePlayer().mark} into cell[${row}][${column}]... `);
    board.markPlace(row,column,getActivePlayer().mark);


    switchPlayerTurn();
    printNewRound();

  };
  

  printNewRound();

  return{
    playRound, getActivePlayer,
    getBoard: board.getBoard
  };

}

function Screen()
{
    const game = GameController();
    const playerTurn = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurn.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, indexR) => {
            row.forEach((cell,indexC) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = indexC;
                cellButton.dataset.row = indexR;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }


    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;
        
        game.playRound(selectedRow,selectedColumn);
        updateScreen();
      }
      boardDiv.addEventListener("click", clickHandlerBoard);
    
      updateScreen();


}

Screen();
