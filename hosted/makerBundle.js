"use strict";

var handleBoard = function handleBoard(e) {
  e.preventDefault();
  $("#boardMessage").animate({
    width: 'hide'
  }, 350);

  if ($('#boardName').val() == '' || $('#boardSize').val() == '') {
    handleError('Oops! All fields are required');
    return false;
  }

  sendAjax('POST', $('#boardForm').attr('action'), $('#boardForm').serialize(), function () {
    loadBoardsFromServer();
  });
  return false;
};

var BoardForm = function BoardForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "boardForm",
    onSubmit: handleBoard,
    name: "boardForm",
    action: "/maker",
    method: "POST",
    className: "boardForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "boardName",
    type: "text",
    name: "name",
    placeholder: "Board Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "size"
  }, "Size: "), /*#__PURE__*/React.createElement("select", {
    id: "boardSize",
    name: "size"
  }, /*#__PURE__*/React.createElement("optgroup", {
    label: "Default Account"
  }, /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, "Small"), /*#__PURE__*/React.createElement("option", {
    value: "10"
  }, "Medium")), /*#__PURE__*/React.createElement("optgroup", {
    label: "Premium Account"
  }, /*#__PURE__*/React.createElement("option", {
    value: "15",
    disabled: true
  }, "Large"))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeBoardSubmit",
    type: "submit",
    value: "Make Board"
  }));
};

var BoardList = function BoardList(props) {
  if (props.boards === undefined || props.boards.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "boardList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyBoard"
    }, "No Boards yet"));
  }

  var boardNodes = props.boards.map(function (board) {
    return /*#__PURE__*/React.createElement("div", {
      key: board._id,
      className: "board"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "boardName"
    }, "Name: ", board.name), /*#__PURE__*/React.createElement("div", {
      className: "boardDrawing"
    }, " ", drawBoard(board.board)), /*#__PURE__*/React.createElement("button", {
      className: "boardEditButton",
      onClick: function onClick() {
        loadBoardToEdit(board);
      }
    }, "Edit"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "boardList"
  }, boardNodes);
};

var loadBoardsFromServer = function loadBoardsFromServer() {
  sendAjax('GET', '/getBoards', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
      boards: data.boards
    }), document.querySelector('#boards'));
  });
};

var loadBoardToEdit = function loadBoardToEdit(board) {
  sendAjax('GET', '/edit?name=' + board.name, null, null);
};

var setupMaker = function setupMaker(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardForm, {
    csrf: csrf
  }), document.querySelector('#makeBoard'));
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
    boards: []
  }), document.querySelector('#boards'));
  loadBoardsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupMaker(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#boardMessage').animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $('#boardMessage').animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var drawBoard = function drawBoard(boardInfo) {
  var boardRow = function boardRow(row) {
    return row.map(function (button, index) {
      return /*#__PURE__*/React.createElement("button", {
        key: row + 'button' + index,
        className: "boardButton",
        style: {
          backgroundColor: button.value
        }
      });
    });
  };

  var board = boardInfo.map(function (row, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: 'row' + index,
      className: "boardRow"
    }, boardRow(row));
  });
  return /*#__PURE__*/React.createElement("div", null, board);
};
