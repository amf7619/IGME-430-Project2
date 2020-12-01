const handleError = (message) => {
    $('#errorMessage').text(message);
    $('#boardMessage').animate({width:'toggle'},350);
};

const redirect = (response) => {
    $('#boardMessage').animate({width:'hide'}, 350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
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