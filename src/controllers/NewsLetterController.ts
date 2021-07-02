import { Request, Response } from 'express';
import db from '../database/connections';
import fasterDataCollect from '../script/fastPuppeter';
import nodemailer from 'nodemailer'

export default class NewsLetter {
  async index(request: Request, response: Response) {
      const newsLetter = await db('newsLetter').select('*');

        //@ts-ignore
      return response.json(newsLetter);
  }

  async create(request: Request, response: Response) {
    const { ProductName, price,website_id,user_id, schedule_id} = request.body

    console.log(request.body)

    const trx = await db.transaction();

    try {
      const site = await trx('websites').where({id: website_id}).first();
      const user = await trx('users').where({id: user_id}).first();
      const schedule = await trx('schedule_time').where({id: schedule_id}).first();
      const alreadyExist = await trx('newsLetter').where({ProductName: ProductName, website_id: website_id}).first();

      if(site && user && schedule){  
        if(!alreadyExist){

          var date = new Date();
          var next_email_Date =
          date.getFullYear() + "-" +
            ("00" + (date.getMonth() + 2)).slice(-2) + "-" +
            ("00" + date.getDate()).slice(-2) + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
  
          // console.log(next_email_Date)
          
          var sended_at =
          date.getFullYear() + "-" +
          ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
          ("00" + date.getDate()).slice(-2) + " " +
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2) + ":" +
          ("00" + date.getSeconds()).slice(-2);
          
          
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
  
          const a = await fasterDataCollect({
            Supermarket: site.Name,
            product: ProductName, 
            url: site.url, 
            XPath: site.XPath, 
            ImgXPath: site.ImgXPath,
            NameXPath: site.NameXPath,
            PriceXPath: site.PriceXPath,
        });
        console.log(a)
  
        if(a === null || a === undefined){
          await trx.rollback();
          return response.status(400).json({
              error: 'Produto não encontrado',
          });
        }else{
  
          await transporter.sendMail({
            from: "testeemail1@sapo.pt",
            to: user.email,
            subject: 'NewsLetter Shoprice',
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
            
            if(schedule_id == 1){
    
                var date = new Date(); 
                var datePlusDay =
              date.getFullYear() + "-" +
              ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
              ("00" + (date.getDate() + 1)).slice(-2) + " " +
              ("00" + date.getHours()).slice(-2) + ":" +
              ("00" + date.getMinutes()).slice(-2) + ":" +
              ("00" + date.getSeconds()).slice(-2);
    
              const newsCreated =  await trx('newsLetter').insert({
                ProductName: a.name,
                price: price,
                website_id: website_id,
                user_id: user_id,
                schedule_id: schedule_id,
                _next_email: datePlusDay,
                _sended_at: sended_at
              });
              
    
          
            await trx.commit(newsCreated);
      
            }else if(schedule_id == 2){
    
              let now = new Date();
              now.setDate(now.getDate() + 1 * 7);
      
              let datePlusWeek = now.getFullYear() + "-" +
              ("00" + (now.getMonth() + 1)).slice(-2) + "-" +
              ("00" + now.getDate()).slice(-2) + " " +
              ("00" + now.getHours()).slice(-2) + ":" +
              ("00" + now.getMinutes()).slice(-2) + ":" +
              ("00" + now.getSeconds()).slice(-2);
      
              const newsCreated =  await trx('newsLetter').insert({
                ProductName: a.name,
                price: price,
                website_id: website_id,
                user_id: user_id,
                schedule_id: schedule_id,
                _next_email: datePlusWeek,
                _sended_at: sended_at
              });
              
            await trx.commit(newsCreated);
    
            }else if(schedule_id == 3){
    
              // var date = new Date(); 
              // var datePlusMonth =
              // date.getFullYear() + "-" +
              // ("00" + (date.getMonth() + 2)).slice(-2) + "-" +
              // ("00" + date.getDate()).slice(-2) + " " +
              // ("00" + date.getHours()).slice(-2) + ":" +
              // ("00" + date.getMinutes()).slice(-2) + ":" +
              // ("00" + date.getSeconds()).slice(-2);
      
              const newsCreated =  await trx('newsLetter').insert({
                ProductName: a.name,
                price: price,
                website_id: website_id,
                user_id: user_id,
                schedule_id: schedule_id,
                _next_email: next_email_Date,
                _sended_at: sended_at
              });
              
    
          
              await trx.commit(newsCreated);
            }
        }
          return response.json();
        } else{
          await trx.rollback();
          return response.status(400).json({
              error: 'Já possui uma NewsLetter com esse Produto e Website',
          });
      }   
      }else{
          await trx.rollback();
          return response.status(400).json({
              error: 'Something went wrong',
          });
      }

  } catch (err) {
      console.log(err);
      await trx.rollback();
      return response.status(400).json({
          err: 'Unexpected error while creating new NewsLetter',
      });
  }
  }

  async indexNewsById(request: Request, response: Response) {
    const {id} = request.body
    const trx = await db.transaction();

  try{
    const site = await trx('newsLetter').where('user_id',id);

    // console.log(site)

    if(site){
      await trx.commit();
      return response.json(site);
    }else{
      await trx.rollback();
      return response.status(400).json({
          error: `Something bad Happen!`,
      });
    }
  }catch(error){
    await trx.rollback();
    return response.status(400).json({
        error: 'We dont have websites working right now!',
    });
  }
}

async delete(request: Request, response: Response) {
    const { id } = request.body;

    console.log(request.body)

    const trx = await db.transaction();

    try {
      const isSuggestion = await trx('newsLetter').where({id: id}).first();
      if(isSuggestion){

        const deletedReport =  await trx('newsLetter').delete().where({id: id});

        await trx.commit(deletedReport);

        return response.json();
      }else{
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while deleting newsLetter',
        });
      }

    } catch (err) {
        console.log(err);
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while deleting Suggestion',
        });
    }
  }
}
