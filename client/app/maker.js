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
                <h3 className='boardName'>Name: {board.name}</h3>
                <div className='boardDrawing'> {drawBoard(board.board)}</div>
                <button className='boardEditButton' onClick={function(){loadBoardToEdit(board)}}>Edit</button>
            </div>
        );
    });

    return (
        <div className='boardList'>
            {boardNodes}
        </div>
    );
};

const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} />, document.querySelector('#boards')
        );
    });
};

const loadBoardToEdit = (board) => {
    window.location.pathname = '/edit';
}

const setupMaker = function(csrf) {
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
        setupMaker(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});