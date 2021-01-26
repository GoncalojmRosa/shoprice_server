import express from 'express';
import UserController from './controllers/UserController';
import ConnectionController from './controllers/ConnectionController';
import authMiddleware from './middlewares/auth';

const routes = express.Router();

const userController = new UserController();
const connectionsController = new ConnectionController();

// routes.use(authMiddleware);

routes.get('/users', authMiddleware, userController.index); // Lista de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/register', userController.create)   ; // Criação de utilizadores
routes.put('/users', authMiddleware, userController.update)   ; // Criação de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/authenticate', userController.authenticate)   ; // Loggin
routes.get('/confirmation/:token', userController.confirmation)   ; // Confirmar o email do Utilizador
// routes.post('/register', userController.create); // Criação de utilizadores na BD 

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

export default routes;
