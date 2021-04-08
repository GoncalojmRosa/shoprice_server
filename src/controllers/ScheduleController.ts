import { Request, Response } from 'express';
import db from '../database/connections';

export default class ScheduleController {
  async index(request: Request, response: Response) {
    const schedules = await db('schedule_time').select('*');

    return response.json(schedules);
  }

  async create(request: Request, response: Response) {
    const { Type } = request.body;

    const trx = await db.transaction();

    try {
        const schedule = await trx('schedule_time').where({Type}).first();

        if(!schedule){

            const scheduleCreated =  await trx('schedule_time').insert({Type});

            await trx.commit(scheduleCreated);


            return response.json();
        }else{
            await trx.rollback();
            return response.status(400).json({
                error: 'This Schedule already exists!',
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
}
