"use strict";

var BoardEdit = function BoardEdit(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "editor"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "color"
  }, "Pick a color: "), /*#__PURE__*/React.createElement("input", {
    type: "color",
    name: "color",
    value: "#ffffff",
    placeholder: "Color Picker"
  }));
};

var BoardItem = function BoardItem(props) {
  if (props.board === undefined) {
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
  }, " ", drawBoard(board.board)), /*#__PURE__*/React.createElement("button", {
    className: "boardEditButton"
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "boardEditButton",
    onClick: loadBoardsFromServer
  }, "Return"));
};

var setupEditor = function setupEditor(board) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardEdit, null), document.querySelector('#editBoard'));
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardItem, {
    board: board
  }), document.querySelector('#boards'));
};

$(document).ready(function () {
  sendAjax('GET', '/getBoard', null, function (result) {
    setupEditor(result.board);
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
