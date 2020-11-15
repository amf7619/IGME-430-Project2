const models = require('../models');

const { Board } = models;

const makerPage = (req, res) => {
  Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), boards: docs });
  });
};

// helper function for creating a new board
const createNewBoard = (size) => {
  const newBoard = [];
  newBoard.length = size;
  for (let i = 0; i < newBoard.length; i++) {
    newBoard[i] = [];
    newBoard[i].length = size;
    for (let j = 0; j < newBoard[i].length; j++) {
      newBoard[i][j] = '#ffffff';
    }
  }
  return newBoard;
};

const makeBoard = (req, res) => {
  if (!req.body.name || !req.body.size) {
    return res.status(400).json({ error: 'Oops! A name and size for the board is required' });
  }

  const BoardData = {
    name: req.body.name,
    board: createNewBoard(req.body.size),
    owner: req.session.account._id,
    size: req.body.size,
  };

  const newBoard = new Board.BoardModel(BoardData);

  const BoardPromise = newBoard.save();

  BoardPromise.then(() => res.json({ redirect: '/maker' }));

  BoardPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Board already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return BoardPromise;
};

const getBoards = (request, response) => {
  const req = request;
  const res = response;

  return Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ Boards: docs });
  });
};

module.exports = {
  makerPage,
  make: makeBoard,
  getBoards,
};
