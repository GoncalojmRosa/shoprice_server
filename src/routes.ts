import express from 'express';
import UserController from './controllers/UserController';
import ConnectionController from './controllers/ConnectionController';
import authMiddleware from './middlewares/auth';
import WebsitesController from './controllers/WebsitesController';

const routes = express.Router();

const userController = new UserController();
const connectionsController = new ConnectionController();
const websiteController = new WebsitesController();

// routes.use(authMiddleware);

routes.get('/users', authMiddleware, userController.index); // Lista de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/register', userController.create); // Criação de utilizadores
routes.put('/profile', authMiddleware, userController.update); // Criação de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/authenticate', userController.authenticate); // Login
routes.get('/confirmation/:token', userController.confirmation); // Confirmar o email do Utilizador
routes.post('/profile', userController.indexUser); // Confirmar o email do Utilizador
// routes.post('/register', userController.create); // Criação de utilizadores na BD 

routes.get('/websites', websiteController.index);
routes.post('/websites', websiteController.create);
routes.post('/products', websiteController.products);


routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

export default routes;
