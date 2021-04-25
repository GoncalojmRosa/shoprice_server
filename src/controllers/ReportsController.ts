import { Request, Response } from 'express';
import db from '../database/connections';

export default class ConnectionController {
  async index(request: Request, response: Response) {
    const reports = await db('reports').select('*');
    const users = await db('users').select('*');

    const reportsFormated = reports.map(report => ({
        ...report,
        user: users.filter(u => u.id === report.user_id)[0].name
      }));

    return response.json(reportsFormated);
  }

  async create(request: Request, response: Response) {
    const { Title, Summary, user_id } = request.body;

    console.log(request.body)

    const trx = await db.transaction();

    try {
        const isUser = await trx('users').where({id: user_id}).first();

        if(isUser){

          const newReport =  await trx('reports').insert({Title: Title, Summary: Summary, user_id: user_id });

          await trx.commit(newReport);


          return response.json();
        }else{
            await trx.rollback();
            return response.status(400).json({
                error: 'Something bad happened',
            });
        }

    } catch (err) {
        console.log(err);
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while creating new Schedule',
        });
    }
  }

  async update(request: Request, response: Response) {
    const { id, Title, Summary, Priority,Status,Tags } = request.body;

    console.log(request.body)

    const trx = await db.transaction();

    try {


        const updateReport =  await trx('reports').update({Title: Title, Summary: Summary, Priority: Priority, Status: Status,Tags: Tags }).where({id: id});

        await trx.commit(updateReport);


        return response.json();


    } catch (err) {
        console.log(err);
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while creating new Schedule',
        });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const trx = await db.transaction();

    console.log(id)

    try {
      const isReported =  await trx('reports').where({id: id}).first();
      if(isReported){

        const deletedReport =  await trx('reports').delete().where({id: id});

        await trx.commit(deletedReport);


        return response.json();
      }else{
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while deleting report',
        });
      }

    } catch (err) {
        console.log(err);
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while deleting report',
        });
    }
  }
}
