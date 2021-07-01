import express from 'express';
import UserController from './controllers/UserController';
import ConnectionController from './controllers/ConnectionController';
import CategoriesController from './controllers/CategoriesController';
import NewsLetter from './controllers/NewsLetterController';
import authMiddleware from './middlewares/auth';
import WebsitesController from './controllers/WebsitesController';
import ScheduleController from './controllers/ScheduleController';
import SuggestionsController from './controllers/SuggestionsController';
import CommentsController from './controllers/CommentsController';
import ReportController from './controllers/ReportsController';
import cron from 'node-cron';
import db from './database/connections';
import fasterDataCollect from './script/fastPuppeter';
import nodemailer from 'nodemailer';
import adminMiddleware from './middlewares/authAdmin';
import demoMiddleware from './middlewares/authDemo';
import rateLimit from "express-rate-limit";
import multer from 'multer';
import storage from './config/multer';

const limiter_for_Normal_routes = rateLimit({
    windowMs: 20 * 1000, // 20 Segundos
    max: 1, // 1 request a cada 20 Segundos
    message: "Pedimos que pare com o Spam!",
    statusCode: 400
  });
const limiter_for_auth_routes = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hora
    max: 5, // 5 request a cada 1 Hora
    message: "Demasiadas contas criadas a partir deste IP, tente mais tarde!",
    statusCode: 400
  });


const parser = multer({ storage: storage });

const routes = express.Router();

const userController = new UserController();
const connectionsController = new ConnectionController();
const websiteController = new WebsitesController();
const categoriesController = new CategoriesController();
const newsLetter = new NewsLetter();
const schedule = new ScheduleController();
const suggestions = new SuggestionsController();
const comments = new CommentsController();
const reports = new ReportController();

// routes.use(authMiddleware);

// cron.schedule('* * * * *', async function(){
//     const trx = await db.transaction();
// console.log("--------------- Cron Job Running ----------------")

//     const user = await trx('users').delete().where('_created_at', '<', 'CURRENT_TIMESTAMP - INTERVAL 10 SECONDS').andWhere('isConfirmed', '=', 0);

//     await trx.commit(user)
// })

cron.schedule('0 * * * *', async function(){
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
        if(news.length != 0){
    
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

            
                const a = await fasterDataCollect({
                    Supermarket: site.Name,
                    product: news[i].ProductName, 
                    url: site.url, 
                    XPath: site.XPath, 
                    ImgXPath: site.ImgXPath,
                    NameXPath: site.NameXPath,
                    PriceXPath: site.PriceXPath,
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
                  }else if(schedule.id == 3){
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
                await transporter.sendMail({
                    from: "testeemail1@sapo.pt",
                    to: user.email,
                    subject: 'Confirm Email',
                    html: `<!DOCTYPE html>
                    <html>
                    
                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            body,
                            table,
                            td,
                            a {
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }
                    
                            table,
                            td {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }
                    
                            img {
                                -ms-interpolation-mode: bicubic;
                            }
                    
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }
                    
                            table {
                                border-collapse: collapse !important;
                            }
                    
                            body {
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }
                    
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }
                    
                            @media screen and (max-width: 480px) {
                                .mobile-hide {
                                    display: none !important;
                                }
                    
                                .mobile-center {
                                    text-align: center !important;
                                }
                            }
                    
                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] {
                                margin: 0 !important;
                            }
                        </style>
                    
                    <body style="margin: 0 !important; padding: 0 !important; background-color: #eeeeee;" bgcolor="#eeeeee">
                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Open Sans, Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> </div>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="background-color: #eeeeee;" bgcolor="#eeeeee">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                                        <tr>
                                            <td align="center" valign="top" style="font-size:0; padding: 35px;" bgcolor="#ff7361">
                                                <div style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 800; line-height: 48px;" class="mobile-center">
                                                                <h1 style="font-size: 36px; font-weight: 800; margin: 0; color: #ffffff;">Shoprice</h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;" class="mobile-hide">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                        <tr>
                                                            <td align="right" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                                                <table cellspacing="0" cellpadding="0" border="0" align="right">
                                                                    <tr>
                                                                        <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400;">
                                                                            <p style="font-size: 18px; font-weight: 400; margin: 0; color: #ffffff;"><a href="#" target="_blank" style="color: #ffffff; text-decoration: none;">Criar &nbsp;</a></p>
                                                                        </td>
                                                                        <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 24px;"> <a href="#" target="_blank" style="color: #ffffff; text-decoration: none;"><img src="https://img.icons8.com/dusk/64/000000/add-shopping-cart.png" width="27" height="23" style="display: block; border: 0px;" /></a> </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 35px; background-color: #ffffff;" bgcolor="#ffffff">
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                                                    <tr>
                                                        <td align="center" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-bottom: 15px; border-bottom: 3px solid #eeeeee;"> <img src=${a?.img} width="190" height="187" style="display: block; border: 0px;" /><br>
                                                            <h2 style="font-size: 30px; font-weight: 800; line-height: 36px; color: #333333; margin: 0;"> Obrigado por nos escolher </h2>
                                                            <p style="font-size: 16px; font-weight: 400; line-height: 24px; color: #777777;"> Você criou uma NewsLetter com o Produto "${a?.name}" criado em ${sended_at}. Receberá as informações ${schedule.Type}. </br> Obrigado!</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 25px 0;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 5px;" bgcolor="#ed8e20"> <a href=${a?.url} target="_blank" style="font-size: 18px; font-family: Open Sans, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; background-color: #ed8e20; padding: 15px 30px; border: 1px solid #ed8e20; display: block;">${a?.price}</a> </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    
                    </html>`,
                });
            }
        }else{
            await trx.rollback();
        }
        
    } catch (error) {
        console.log(error);
        await trx.rollback();
   
    }

})

routes.get('/users',authMiddleware, adminMiddleware, userController.index); // Lista de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/register', limiter_for_auth_routes, userController.create); // Criação de utilizadores
routes.put('/profile', authMiddleware, demoMiddleware, parser.single("image"), userController.update); // Criação de utilizadores & Precisa de fornecer um token para aceder a esta rota
routes.post('/authenticate', userController.authenticate); // Login
routes.get('/confirmation/:token', userController.confirmation); // Confirmar o email do Utilizador
routes.post('/profile', authMiddleware, userController.indexUser); // Confirmar o email do Utilizador
routes.delete('/users', authMiddleware, userController.deleteUser); // Eliminar user
routes.put('/updatePassword', authMiddleware , demoMiddleware, userController.updatePassword); // Eliminar user
routes.post('/passwordToken', userController.sendChangePasswordToken); // Eliminar user
routes.put('/changePassword', userController.changePassword); // Eliminar user
routes.post('/search', userController.searchByLetters); // Eliminar user
routes.put('/avatar', authMiddleware, demoMiddleware, parser.single("image"),userController.updateAvatar); // Confirmar o email do Utilizador
// routes.post('/register', userController.create); // Criação de utilizadores na BD 

routes.get('/newsletter', newsLetter.index);
routes.post('/indexNewsLetter', newsLetter.indexNewsById);
routes.post('/newsletter', newsLetter.create);

routes.get('/schedule', schedule.index);
routes.post('/schedule', schedule.create);

routes.get('/suggestions', suggestions.index);
routes.post('/userSuggestion', suggestions.getSuggestionByUserId);
routes.post('/suggestions', suggestions.create);
routes.get('/allSuggestions', suggestions.indexAll);
routes.delete('/suggestions', suggestions.delete);

routes.get('/reports',reports.index);
routes.post('/reports', reports.create);
routes.put('/reports', reports.update);
routes.delete('/reports', reports.delete);

routes.get('/comments', comments.index);
routes.post('/comments', comments.create);

routes.get('/websites', websiteController.index);
routes.post('/websites', websiteController.create);
routes.put('/websites', websiteController.update);
routes.post('/indexWebsites', websiteController.indexSiteById);
routes.post('/products', websiteController.products);


routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

routes.post('/categories', categoriesController.create);
routes.get('/categories', categoriesController.index);
routes.post('/siteCategories', categoriesController.indexBySite);


export default routes;
