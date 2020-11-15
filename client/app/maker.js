const handleBoard = (e) => {
    e.preventDefault();

    $("#boardMessage").animate({width:'hide'}, 350);

    if($('#boardName').val() == '' || $('#boardSize').val() == '') {
        handleError('Oops! All fields are required');
        return false;
    }

    sendAjax('POST', $('#boardForm').attr('action'), $('#boardForm').serialize(), function() {
        loadBoardsFromServer();
    });

    return false;
}

const BoardForm = (props) => {
    return (
        <form id='boardForm'
            onSubmit={handleBoard}
            name='boardForm'
            action='/maker'
            method='POST'
            className='boardForm'>
            <label htmlFor='name'>Name: </label>
            <input id='boardName' type='text' name='name' placeholder='Board Name'/>
            <label htmlFor='size'>Size: </label>
            <input id='boardSize' type='text' name='size' placeholder='Board Size'/>                FIX THIS!!!!!
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeBoardSubmit' type='submit' value='Make Board'/>
        </form>
    );
};

const BoardList = function(props) {
    if(props.boards.length === 0) {
        return (
            <div className='boardList'>
                <h3 className='emptyBoard'>No Boards yet</h3>
            </div>
        );
    }

    const boardNodes = props.boards.map(function(board) {
        return (
            <div key={board._id} className='board'>
                <img src='/assets/img/boardface.jpeg' alt='board face' className='boardFace' />
                <h3 className='boardName'>Name: {board.name}</h3>
                <h3 className='boardDrawing'> drawBoard(board.board)</h3>
            </div>
        );
    });

    return (
        <div className='boardList'>
            {boardNodes}
        </div>
    );
};

const drawBoard = (board) => {
    let rows = document.createElement('div');
    for(let i = 0; i < board.length; i++) {
        let newRow = document.createElement('div');
        for(let j = 0; j < board[i].length; j++) {
            let newButton = document.createElement('button');
            newButton.setAttribute('className', 'boardButton');
            newButton.style.backgroundColor = board[i][j];
            newRow.appendChild(newButton);
        }
        rows.appendChild(newRow);
    }
}

const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} />, document.querySelector('#boards')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <BoardForm csrf={csrf} />, document.querySelector('#makeBoard')
    );

    ReactDOM.render(
        <BoardList boards={[]} />, document.querySelector('#boards')
    );

    loadBoardsFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});