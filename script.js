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
        if(selectedCell.getValue() != " " )
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
    let value = " ";

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

    const getWinnerPlayer = () => activePlayer.name;

    
    const playRound = (row,column) => {
        
        const boardGame = board.getBoard();

        console.log(`Marking ${getActivePlayer().name}'s ${getActivePlayer().mark} into cell[${row}][${column}]... `);

        //if winner is not found mark "X" and "O";
        if(gameEndStatus!=true) {
            board.markPlace(row,column,getActivePlayer().mark);
        }

        //check for three in a row win
        for(let i = 0; i < 3; i++) {
            const cell1 = boardGame[i][0].getValue();
            const cell2 = boardGame[i][1].getValue();
            const cell3 = boardGame[i][2].getValue();
            if((cell1 !=" ") && cell1 === cell2 && cell2=== cell3) {
                console.log( "winner");
                gameEndStatus = true;
                return getWinnerPlayer();
            }
        }

        //check for three in a column win
        for(let i = 0; i < 3; i++) {
            const cell1 = boardGame[0][i].getValue();
            const cell2 = boardGame[1][i].getValue();
            const cell3 = boardGame[2][i].getValue();
            if((cell1 !=" ") && cell1 === cell2 && cell2=== cell3) {
                console.log( "winner");
                gameEndStatus = true;
                return getWinnerPlayer();
            }
        }

        // check for  three in diagonal( \ ) win
        if(boardGame[0][0].getValue()!=" " && boardGame[0][0].getValue() == boardGame[1][1].getValue() && boardGame[1][1].getValue() == boardGame[2][2].getValue()){
            console.log( "winner");
            gameEndStatus = true;
            return getWinnerPlayer();
        }

        // check for  three in diagonal( / ) win
        if(boardGame[0][2].getValue()!=" " && boardGame[0][2].getValue() == boardGame[1][1].getValue() && boardGame[1][1].getValue() == boardGame[2][0].getValue()){
            console.log( "winner");
            gameEndStatus = true;
            return getWinnerPlayer();
        }

        //Check for tie
        let numOfCells = 0;
        boardGame.forEach((row) => {
            row.forEach((cell) => {
                if(cell.getValue() === "X" || cell.getValue() === "O")
                {
                    numOfCells +=1;
                }
            })
        })
        if(numOfCells === 9) {
            gameEndStatus = true;
            return "Tie";
        }

        
        switchPlayerTurn();
        printNewRound();
  };
  

  printNewRound();

  return{                           
    playRound, getActivePlayer, getWinnerPlayer,
    getBoard: board.getBoard
  };

}

function Players(){
    var player1;
    var player2;


     player1 = document.getElementById('player1').value;
     player2 = document.getElementById('player2').value;


    /*

    const form = document.getElementById("Form");
    form.addEventListener('submit',(event)=>{
        player1 = form.getElementById("player1").textContent;
        console.log(player1);
        player2 = form.getElementById("player2").value;
    })
*/
    return [player1, player2];
}

function Screen()
{
    const players = Players();
    const game = GameController(players[0],players[1]);

   // const game = GameController();

    const playerTurn = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = (winner) => {
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

        /////////////////////////
        if(winner != null && winner != "Tie"){
            console.log("Winner is: " + winner);
            console.log("Active is: "+activePlayer.name);
            playerTurn.textContent = `${winner} WON!`;
            return;
        }

        if(winner === "Tie"){
            playerTurn.textContent = "It's a TIE.";
            return;
        }
    }


    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;
        /////////////
        let round = game.playRound(selectedRow,selectedColumn);
        updateScreen(round);
      }

      boardDiv.addEventListener("click", clickHandlerBoard);
    
      updateScreen();


}

Screen();
