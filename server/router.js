const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getBoards', mid.requiresLogin, controllers.Board.getBoards);
  app.get('/getBoard', mid.requiresLogin, controllers.Board.getBoard);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/upgrade', mid.requiresSecure, mid.requiresLogin, controllers.Account.upgrade);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Board.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Board.make);
  app.get('/edit', mid.requiresLogin, controllers.Board.editorPage);
  app.post('/edit', mid.requiresLogin, controllers.Board.edit);
  app.get('/loginInfo', mid.requiresLogin, controllers.Account.loginInfo);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
