const models = require('../models');

const { Board } = models;

const makerPage = (req, res) => {
  Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('maker', { csrfToken: req.csrfToken(), boards: docs });
  });
};

const editorPage = (req, res) => {
  Board.BoardModel.findByName(req.session.account._id, req.query.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    if (docs.length === 0) {
      return res.status(400).json({ error: 'There is no board with that name' });
    }

    return res.render('editor');
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

  Board.BoardModel.findByName(req.session.account._id, req.body.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    if (docs.length > 0) {
      return res.status(400).json({ error: 'There is already a board with that name' });
    }

    return res.status(202).json({ message: 'The name for that board has not yet been used' });
  });


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

const editBoard = (req, res) => {

  const updateInfo = {
    board: req.body.board,
  };

  Board.BoardModel.updateBoard(req.session.account._id, req.body.name, updateInfo, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(201).json({ message: 'Board updated' });
  });
};


const getBoards = (request, response) => {
  const req = request;
  const res = response;

  return Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ boards: docs });
  });
};

const getBoard = (request, response) => {
  const req = request;
  const res = response;

  return Board.BoardModel.findByName(req.session.account._id, req.query.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    if (docs.length === 0) {
      return res.status(400).json({ error: 'There is no board with that name' });
    }

    return res.json({ board: docs[0] });
  });
};

module.exports = {
  makerPage,
  editorPage,
  make: makeBoard,
  edit: editBoard,
  getBoards,
  getBoard,
};
