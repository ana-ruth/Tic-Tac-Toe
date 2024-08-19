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

        if(selectedCell != 0 ) return;
    
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


