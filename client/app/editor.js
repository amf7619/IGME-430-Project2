const BoardEdit = function(props) {
    return (
        <div className='editor'>
            <label htmlFor='color'>Pick a color: </label>
            <input id='colorPicker' type='color' name='color' value='#ffffff' placeholder='Color Picker'/>
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
        <div key={board._id} className='board'>
            <h3 className='boardName'>Name: {board.name}</h3>
            <div className='boardDrawing'> {drawBoard(board.board)}</div>
            <button className='boardEditButton'>Save</button>
            <button className='boardEditButton' onClick={loadBoardsFromServer}>Return</button>
        </div>
    );
}

const setupEditor = (board) => {
    ReactDOM.render(
        <BoardEdit/>, document.querySelector('#editBoard')
    )

    ReactDOM.render(
        <BoardItem board={board} />, document.querySelector('#boards')
    );
};

$(document).ready(function() {
    sendAjax('GET', '/getBoard', null, (result) => {
        setupEditor(result.board);
    });
});