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

    const trx = await db.transaction();

    try {
      const site = await trx('websites').where({id: website_id}).first();
      const user = await trx('users').where({id: user_id}).first();
      const schedule = await trx('schedule_time').where({id: schedule_id}).first();

      if(site && user && schedule){       
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
        
        console.log(schedule_id)
        
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
            ProductName: ProductName,
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
            ProductName: ProductName,
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
            ProductName: ProductName,
            price: price,
            website_id: website_id,
            user_id: user_id,
            schedule_id: schedule_id,
            _next_email: next_email_Date,
            _sended_at: sended_at
          });
          

      
          await trx.commit(newsCreated);
        }

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



      await transporter.sendMail({
        from: "testeemail1@sapo.pt",
        to: user.email,
        subject: 'Confirm Email',
        html: `Price ${a?.price}`,
    });


        return response.json();
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
}
