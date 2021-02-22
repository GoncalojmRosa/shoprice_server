import { Request, Response } from 'express';
import db from '../database/connections';

export default class ConnectionController {
  async index(request: Request, response: Response) {
    const {website_id} = request.body
    
    const total = await db('categories').where({website_id: website_id});

    return response.json({Alimentacao: total});
  }

  async create(request: Request, response: Response) {
    const { website_id, name, queryString } = request.body;

    const trx = await db.transaction();

    try{
      const siteId = await trx('websites').where({id: website_id}).first();

      if(siteId){

        const categoryCreated = await trx('categories').insert({
          name,
          queryString,
          website_id
        });

        await trx.commit(categoryCreated);

        return response.status(201).send();
      }else{
        await trx.rollback();
        return response.status(400).json({
            error: `We dont have websites with the id #${website_id}`,
        });
      }

  

    }catch(error){
      await trx.rollback();
      return response.status(400).json({
          error: 'We dont have websites working right now!',
      });
    }
  }
}
