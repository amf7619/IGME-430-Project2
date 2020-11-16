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
            <select id='boardSize' name='size'>
                <optgroup label='Default Account'> 
                    <option value='5'>Small</option> 
                    <option value='10'>Medium</option>
                </optgroup> 
                <optgroup label='Premium Account'>
                    <option value='15' disabled>Large</option>
                </optgroup>  
            </select>
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeBoardSubmit' type='submit' value='Make Board'/>
        </form>
    );
};

const BoardList = function(props) {

    if(props.boards === undefined || props.boards.length === 0) {
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
                <div className='boardDrawing'> {drawBoard(board.board)}</div>
                <button className='boardEditButton' onClick={loadBoardToEdit(board)}>Edit</button>
            </div>
        );
    });

    return (
        <div className='boardList'>
            {boardNodes}
        </div>
    );
};

const drawBoard = (boardInfo) => {

    const boardRow = (row) => {
        return row.map(function(button, index) {
            return (
                <button key={row + 'button' + index} className='boardButton' style={{backgroundColor: button.value}}></button>
            );
        });
    };

    const board = boardInfo.map(function(row, index) {
        return (
            <div key={'row' + index} className='boardRow'>{boardRow(row)}</div>
        );
    });

    return (
        <div>{board}</div>
    );
}

const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} />, document.querySelector('#boards')
        );
    });
};

//WORKING ON THIS
const BoardEdit = function(props) {
    //failsafe, not coded well. Do later
    if(props.board === undefined) {
        return (
            <div className='boardList'>
                <h3 className='emptyBoard'>No board was selected</h3>
            </div>
        );
    }

    return (
        <div className='boardList'>
            {drawBoard(props.board)}
        </div>
    );
}

//WORKING ON THIS
const loadBoardToEdit = (board) => {
    sendAjax('GET', '/getBoard', board, (data) => {
        ReactDOM.render(
            <BoardEdit board={data.board} />, document.querySelector('#boards')
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