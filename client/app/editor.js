let csrf, board;

const BoardEdit = function() {
    return (
        <div className='editor'>
            <label htmlFor='color'>Pick a color: </label>
            <input id='colorPicker' type='color' name='color' placeholder='Color Picker'/>
            <form id='saveEditForm' action='/edit' method='POST' onSubmit={saveBoard}>
                <input type='submit' className='boardEditButton' value='Save'/>
            </form>
            <form action='/maker' method='GET'>
                <button className='boardEditButton'>Return</button>
            </form>
        </div>
    );
}

const BoardItem = function() {

    if(board === undefined) {
        return (
            <div className='boardList'>
                <h3 className='emptyBoard'>No Board was selected</h3>
            </div>
        );
    }

    return (
        <div key={board._id} className='board'>
            <h3 className='boardName'>Name: {board.name}</h3>
            <div className='boardDrawing'> {drawBoard(board.board)}</div>
        </div>
    );
}

const setupButtonControls = () => {
    let colorPicker = document.querySelector("#colorPicker");
    let buttons = document.querySelectorAll('.boardButton');

    for(let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            buttons[i].value = colorPicker.value;
            buttons[i].style.backgroundColor = colorPicker.value;
        }
    }
}

//WORKING ON THIS
const saveBoard = (e) => {
    e.preventDefault();

    const buttons = document.querySelectorAll('.boardButton');

    const newBoard = board.board;
    
    for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard[i].length; j++) {
            newBoard[i][j] = buttons[(newBoard[i].length * i) + j].value;

            console.log(buttons[(newBoard[i].length * i) + j].value);
        }
    }

    const data = {
        name: board.name,
        board: newBoard,
        csrf: csrf,
    }

    sendAjax('POST', '/edit', data, function() {
        console.log('success!');
    });
}

const setupEditor = (result, csrfToken) => {

    csrf = csrfToken;
    board = result.board;

    ReactDOM.render(
        <BoardEdit />, document.querySelector('#editBoard')
    )

    ReactDOM.render(
        <BoardItem />, document.querySelector('#board')
    );

    setupButtonControls();
};

$(document).ready(function() {

    let csrfToken;

    getToken((result) => {
        csrfToken = result.csrfToken;
    })

    const params = new URLSearchParams(window.location.search);
    let url = '/getBoard?name='+params.get('name');

    sendAjax('GET', url, null, (result) => {
        setupEditor(result, csrfToken);
    });
});