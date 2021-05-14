import { Request, Response } from 'express';
import db from '../database/connections';
import { updateReport } from '../models/ReportModel';

async function update(
  id: number,
  Title: string,
  Status: string,
  Summary: string,
  Priority: string,
  Tags: string,
){
  const trx = await db.transaction();
  const reports = await trx('reports').update({Title: Title, Summary: Summary, Priority: Priority, Status: Status,Tags: Tags }).where({id: id});
  await trx.commit(reports)
}


export default class ReportsController {
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
    const {Reports} = request.body;

    const trx = await db.transaction();

    try {

      Reports.map((report: any) =>{
       update(report.id, report.Title, report.Status, report.Summary, report.Priority, report.Tags)
      })

      trx.commit()
      return response.json();


    } catch (err) {
        console.log(err);
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while creating new Report',
        });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.body;

    const trx = await db.transaction();

    console.log(request.body)

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
