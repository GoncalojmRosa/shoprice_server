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
import fasterDataCollect from './script/fastPuppeter';
import nodemailer from 'nodemailer';
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

cron.schedule('*/10 * * * * *', async function(){
    const trx = await db.transaction();
    console.log("--------------- Cron Job Running ----------------")

    var date = new Date();

    let now = new Date();
    now.setDate(now.getDate() + 1 * 7);

    let datePlusWeek = now.getFullYear() + "-" +
            ("00" + (now.getMonth() + 1)).slice(-2) + "-" +
            ("00" + now.getDate()).slice(-2) + " " +
            ("00" + now.getHours()).slice(-2) + ":" +
            ("00" + now.getMinutes()).slice(-2) + ":" +
            ("00" + now.getSeconds()).slice(-2);

    var sended_at =
        date.getFullYear() + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);

        var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    
        var ye_format =
        yesterday.getFullYear() + "-" +
        ("00" + (yesterday.getMonth() + 1)).slice(-2) + "-" +
        ("00" + yesterday.getDate()).slice(-2) + " " +
        ("00" + yesterday.getHours()).slice(-2) + ":" +
        ("00" + yesterday.getMinutes()).slice(-2) + ":" +
        ("00" + yesterday.getSeconds()).slice(-2);
    const news = await trx('newsLetter').select().whereBetween('_next_email', [ye_format, sended_at])

    try {
        console.log(news)
        if(news.length != 0){
            console.log(news[0].website_id)
    
            let transporter = nodemailer.createTransport({
                name: "Email Verification",
                host: "smtp.sapo.pt",
                port: 25,
                secure: false, // true for 465,cls false for other ports
                auth: {
                    user: "testeemail1@sapo.pt", // generated ethereal user
                    pass: "testeEmail!12345", // generated ethereal password
                },
            });
            for(var i = 0; i<news.length; i++){
    
                const site = await trx('websites').where({id: news[i].website_id}).first();
                const user = await trx('users').where({id: news[i].user_id}).first();
                const schedule = await trx('schedule_time').where({id: news[i].schedule_id}).first();

                console.log(schedule)
            
                const a = await fasterDataCollect({
                    Supermarket: site.Name,
                    product: news[i].ProductName, 
                    url: site.url, 
                    XPath: site.XPath, 
                    ImgXPath: site.ImgXPath,
                    NameXPath: site.NameXPath,
                    PriceXPath: site.PriceXPath,
                });
                
                    await transporter.sendMail({
                      from: "testeemail1@sapo.pt",
                      to: user.email,
                      subject: 'Confirm Email',
                      html: `Price ${a?.price}`,
                  });
                
                  if(schedule.id == 1){
    
                      
                      var date = new Date(); 
                      var datePlusDay =
                    date.getFullYear() + "-" +
                      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
                      ("00" + (date.getDate() + 1)).slice(-2) + " " +
                      ("00" + date.getHours()).slice(-2) + ":" +
                      ("00" + date.getMinutes()).slice(-2) + ":" +
                      ("00" + date.getSeconds()).slice(-2);
                  
                      const newsCreated =  await trx('newsLetter').update({
                          ProductName: news[i].ProductName,
                          price: news[i].Price,
                          website_id: news[i].website_id,
                          user_id: news[i].user_id,
                          schedule_id: news[i].schedule_id,
                          _next_email: datePlusDay,
                          _sended_at: sended_at
                      }).where({id: news[i].id});
      
                      await trx.commit(newsCreated)
                  }else if(schedule.id == 2){
    
                    const newsCreated =  await trx('newsLetter').update({
                        ProductName: news[i].ProductName,
                        price: news[i].Price,
                        website_id: news[i].website_id,
                        user_id: news[i].user_id,
                        schedule_id: news[i].schedule_id,
                        _next_email: datePlusWeek,
                        _sended_at: sended_at
                    }).where({id: news[i].id});
    
                    await trx.commit(newsCreated)
                  }else{
                    var datePlusMonth =
                    date.getFullYear() + "-" +
                      ("00" + (date.getMonth() + 2)).slice(-2) + "-" +
                      ("00" + date.getDate()).slice(-2) + " " +
                      ("00" + date.getHours()).slice(-2) + ":" +
                      ("00" + date.getMinutes()).slice(-2) + ":" +
                      ("00" + date.getSeconds()).slice(-2);
                  
                    const newsCreated =  await trx('newsLetter').update({
                        ProductName: news[i].ProductName,
                        price: news[i].Price,
                        website_id: news[i].website_id,
                        user_id: news[i].user_id,
                        schedule_id: news[i].schedule_id,
                        _next_email: datePlusMonth,
                        _sended_at: sended_at
                    }).where({id: news[i].id});
        
                    await trx.commit(newsCreated)
        
                }
            }
        }else{
            await trx.rollback();
        }
        
    } catch (error) {
        console.log(error);
        await trx.rollback();
   
    }

})

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
