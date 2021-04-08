import express from 'express';
import UserController from './controllers/UserController';
import ConnectionController from './controllers/ConnectionController';
import CategoriesController from './controllers/CategoriesController';
import NewsLetter from './controllers/NewsLetterController';
import authMiddleware from './middlewares/auth';
import WebsitesController from './controllers/WebsitesController';
import ScheduleController from './controllers/ScheduleController';
import cron from 'node-cron';
import db from './database/connections';
const multer = require('multer');
const storage = require('./config/multer')

const parser = multer({ storage: storage });

const routes = express.Router();

const userController = new UserController();
const connectionsController = new ConnectionController();
const websiteController = new WebsitesController();
const categoriesController = new CategoriesController();
const newsLetter = new NewsLetter();
const schedule = new ScheduleController();



// routes.use(authMiddleware);

// cron.schedule('* * * * *', async function(){
//     const trx = await db.transaction();
// console.log("--------------- Cron Job Running ----------------")

//     const user = await trx('users').delete().where('_created_at', '<', 'CURRENT_TIMESTAMP - INTERVAL 10 SECONDS').andWhere('isConfirmed', '=', 0);

//     await trx.commit(user)
// })

// cron.schedule('*/10 * * * * *', async function(){
//     const trx = await db.transaction();
//     console.log("--------------- Cron Job Running ----------------")

//     var date = new Date();
//     var sended_at =
//         date.getFullYear() + "-" +
//         ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
//         ("00" + date.getDate()).slice(-2) + " " +
//         ("00" + date.getHours()).slice(-2) + ":" +
//         ("00" + date.getMinutes()).slice(-2) + ":" +
//         ("00" + date.getSeconds()).slice(-2);

//         var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    
//         var ye_format =
//         yesterday.getFullYear() + "-" +
//         ("00" + (yesterday.getMonth() + 1)).slice(-2) + "-" +
//         ("00" + yesterday.getDate()).slice(-2) + " " +
//         ("00" + yesterday.getHours()).slice(-2) + ":" +
//         ("00" + yesterday.getMinutes()).slice(-2) + ":" +
//         ("00" + yesterday.getSeconds()).slice(-2);
//     const news = await trx('newsLetter').select().whereBetween('_next_email', [ye_format, sended_at])

//     console.log(news)

//     await trx.commit(news)
// })

routes.get('/users', authMiddleware, userController.index); // Lista de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/register', userController.create); // Criação de utilizadores
routes.put('/profile', parser.single("image"), userController.update); // Criação de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/authenticate', userController.authenticate); // Login
routes.get('/confirmation/:token', userController.confirmation); // Confirmar o email do Utilizador
routes.post('/profile', userController.indexUser); // Confirmar o email do Utilizador
routes.put('/avatar', parser.single("image"),userController.updateAvatar); // Confirmar o email do Utilizador
// routes.post('/register', userController.create); // Criação de utilizadores na BD 

routes.get('/newsletter', newsLetter.index);
routes.post('/newsletter', newsLetter.create);

routes.get('/schedule', schedule.index);
routes.post('/schedule', schedule.create);

routes.get('/websites', websiteController.index);
routes.post('/websites', websiteController.create);
routes.post('/products', websiteController.products);


routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

routes.post('/categories', categoriesController.create);
routes.get('/categories', categoriesController.index);


export default routes;
