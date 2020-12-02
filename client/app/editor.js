const BoardEdit = function(props) {
    return (
        <div className='editor'>
            <label htmlFor='color'>Pick a color: </label>
            <input id='colorPicker' type='color' name='color' placeholder='Color Picker'/>
            <form id='saveEditForm' action='/edit' method='POST' onSubmit={saveBoard}>
                <input type='hidden' name='name' value={props.result.name}/>
                <input type='hidden' id='boardSaver' name='board' value='bruh'/>
                <input type='hidden' name='_csrf' value={props.result.csrf} />
                <input type='submit' className='boardEditButton' value='Save'/>
            </form>
        </div>
    );
}

const BoardItem = function(props) {

    if(props.board === undefined) {
        return (
            <div className='boardList'>
                <h3 className='emptyBoard'>No Board was selected</h3>
            </div>
        );
    }

    return (
        <div key={props._id} className='board'>
            <h3 className='boardName'>Name: {props.board.name}</h3>
            <div className='boardDrawing'> {drawBoard(props.board.board)}</div>
            <form action='/maker' method='GET'>
                <button className='boardEditButton'>Return</button>
            </form>
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
    const size = Math.sqrt(buttons.length);

    const board = [];
    board.length = size;
    
    for (let i = 0; i < board.length; i++) {
        board[i] = [];
        board[i].length = size;
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = buttons[(board[i].length * i) + j].value;
        }
    }

    console.log(board);

    $('#boardSaver').setState({
        value: JSON.stringify(board),
    });

    console.log($('#boardSaver'));

    sendAjax('POST', '/edit', $('#saveEditForm').serialize(), function() {
        console.log('success!');
    });
}

const setupEditor = (board, csrf) => {
    ReactDOM.render(
        <BoardEdit result={{name: board.name, csrf}}/>, document.querySelector('#editBoard')
    )

    ReactDOM.render(
        <BoardItem board={board} />, document.querySelector('#board')
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
        setupEditor(result.board, csrfToken);
    });
});