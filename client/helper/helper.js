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

const getToken = (callback) => {
    sendAjax('GET', '/getToken', null, callback);
};

const drawBoard = (boardInfo) => {

    const boardRow = (row) => {
        return row.map(function(button, index) {
            return (
                <button key={row + 'button' + index} className='boardButton' style={{backgroundColor: button}} value={button}></button>
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

const handleChangePass = (e) => {
    e.preventDefault();
    $('boardMessage').animate({width:'hide'}, 350);

    //compare new password
    if($('#newPass').val() !== $('#newPass2').val()) {
        handleError("Oops! New passwords do not match");
        return false;
    }

    sendAjax('POST', $('#changePassForm').attr('action'), $('#changePassForm').serialize(), redirect);

    return false;
}

const ChangePassWindow = (props) => {
    return (
        <form id='changePassForm'
            name='changePassForm'
            onSubmit={handleChangePass}
            action='/changePass'
            method='POST'
            className='mainForm'>

            <label htmlFor='newPass'>New Password: </label>
            <input id='newPass' type='text' name='newPass' placeholder='password'/>
            <label htmlFor='newPass2'>Retype New Password: </label>
            <input id='newPass2' type='text' name='newPass2' placeholder='password'/>
            <input type='hidden' name='_csrf' value={props.csrf}/>
            <input className="formSubmit" type='submit' value='Change Password'/>
        </form>
    )
}

const createChangePassPage = (csrf) => {

    ReactDOM.render(null, document.querySelector('#boardSettings'));

    ReactDOM.render(
        <ChangePassWindow csrf={csrf} />,
        document.querySelector('#boards'),
    );
}