import { Request, Response } from 'express';
import db from '../database/connections';

export default class NewsLetter {
  async index(request: Request, response: Response) {
    const newsLetter = await db('newsLetter').select('*');

        //@ts-ignore
        return response.json(newsLetter);
  }

  async create(request: Request, response: Response) {
    const { ProductName, price,website_id,user_id} = request.body

    const trx = await db.transaction();

    try {
      const site = await trx('websites').where({id: website_id}).first();
      const user = await trx('users').where({id: user_id}).first();

      if(site && user){       
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
        
        // console.log(sended_at)
        const newsCreated =  await trx('newsLetter').insert({
          ProductName: ProductName,
          price: price,
          website_id: website_id,
          user_id: user_id,
          _next_email: next_email_Date,
          _sended_at: sended_at
        });

        await trx.commit(newsCreated);

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
          err: 'Unexpected error while creating new Website',
      });
  }
  }
}
