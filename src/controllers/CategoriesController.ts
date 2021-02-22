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

    await db('categories').insert({
      name,
      queryString,
      website_id
    });

    return response.status(201).send();
  }
}
