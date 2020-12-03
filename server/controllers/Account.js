const { json } = require('body-parser');
const models = require('../models');
const { AccountModel } = require('../models/Account');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Oops! All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password.' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.rank = `${req.body.rank}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.rank) {
    return res.status(400).json({ error: 'Oops! All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Oops! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      rank: req.body.rank,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const upgradeAccount = (request, response) => {
  const req = request;
  const res = response;

  const update = {
    rank: req.body.rank,
  };

  Account.AccountModel.updateAccount(req.session.account.username, update, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ account: docs });
  });

  res.redirect('/maker');
};

const loginInfo = (req, res) => {
  Account.AccountModel.findInfoByUsername(req.session.account.username, (err, data) => {
    res.json({ data });
  });
};

const changePass = (req, res) => {

  req.body.newPass = `${req.body.newPass}`;

  Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {

    const update = {
      password: hash,
      salt: salt,
    };

    Account.AccountModel.updateAccount(req.session.account.username, update, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }
  
      return res.json({ account: docs });
    }); 
  });

  res.redirect('/maker');
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  upgrade: upgradeAccount,
  changePass,
  loginInfo,
};
