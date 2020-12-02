"use strict";

var csrf, board;

var BoardEdit = function BoardEdit() {
  return /*#__PURE__*/React.createElement("div", {
    className: "editor"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "color"
  }, "Pick a color: "), /*#__PURE__*/React.createElement("input", {
    id: "colorPicker",
    type: "color",
    name: "color",
    placeholder: "Color Picker"
  }), /*#__PURE__*/React.createElement("form", {
    id: "saveEditForm",
    action: "/edit",
    method: "POST",
    onSubmit: saveBoard
  }, /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "boardEditButton",
    value: "Save"
  })), /*#__PURE__*/React.createElement("form", {
    action: "/maker",
    method: "GET"
  }, /*#__PURE__*/React.createElement("button", {
    className: "boardEditButton"
  }, "Return")));
};

var BoardItem = function BoardItem() {
  if (board === undefined) {
    return /*#__PURE__*/React.createElement("div", {
      className: "boardList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyBoard"
    }, "No Board was selected"));
  }

  return /*#__PURE__*/React.createElement("div", {
    key: board._id,
    className: "board"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "boardName"
  }, "Name: ", board.name), /*#__PURE__*/React.createElement("div", {
    className: "boardDrawing"
  }, " ", drawBoard(board.board)));
};

var setupButtonControls = function setupButtonControls() {
  var colorPicker = document.querySelector("#colorPicker");
  var buttons = document.querySelectorAll('.boardButton');

  var _loop = function _loop(i) {
    buttons[i].onclick = function () {
      buttons[i].value = colorPicker.value;
      buttons[i].style.backgroundColor = colorPicker.value;
    };
  };

  for (var i = 0; i < buttons.length; i++) {
    _loop(i);
  }
}; //WORKING ON THIS


var saveBoard = function saveBoard(e) {
  e.preventDefault();
  var buttons = document.querySelectorAll('.boardButton');
  var newBoard = board.board;

  for (var i = 0; i < newBoard.length; i++) {
    for (var j = 0; j < newBoard[i].length; j++) {
      newBoard[i][j] = buttons[newBoard[i].length * i + j].value;
      console.log(buttons[newBoard[i].length * i + j].value);
    }
  }

  var data = {
    name: board.name,
    board: newBoard,
    _csrf: csrf
  };
  sendAjax('POST', '/edit', data, function () {
    console.log('success!');
  });
};

var setupEditor = function setupEditor(result, csrfToken) {
  csrf = csrfToken;
  board = result.board;
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardEdit, null), document.querySelector('#editBoard'));
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardItem, null), document.querySelector('#board'));
  setupButtonControls();
};

$(document).ready(function () {
  var csrfToken;
  getToken(function (result) {
    csrfToken = result.csrfToken;
  });
  var params = new URLSearchParams(window.location.search);
  var url = '/getBoard?name=' + params.get('name');
  sendAjax('GET', url, null, function (result) {
    setupEditor(result, csrfToken);
  });
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

var getToken = function getToken(callback) {
  sendAjax('GET', '/getToken', null, callback);
};

var drawBoard = function drawBoard(boardInfo) {
  var boardRow = function boardRow(row) {
    return row.map(function (button, index) {
      return /*#__PURE__*/React.createElement("button", {
        key: row + 'button' + index,
        className: "boardButton",
        style: {
          backgroundColor: button
        },
        value: button
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
