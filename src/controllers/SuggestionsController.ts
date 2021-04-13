import { Request, Response } from 'express';
import db from '../database/connections';
import filter from 'bad-words';
import Knex from 'knex';
const wordsEng = require('../config/bad-wordsEng.json')
const wordsPt = require('../config/bad-wordsPt.json')

var wordFitler = new filter()
wordFitler.addWords(...wordsEng)
wordFitler.addWords(...wordsPt)

export default class ScheduleController {
  async index(request: Request, response: Response) {
    const suggestions = await db('suggestions').select('*');
    const comments = await db('comments').select('*');

   const suggestionsFormated = suggestions.map(s => {
     return {
       ...s,
       comments: comments.filter(c => c.suggestion_id === s.id)
     }
   })

    return response.json(suggestionsFormated);
  }

  async create(request: Request, response: Response) {
    const { text, user_id } = request.body;

    const trx = await db.transaction();

    try {
        const isSuggestion = await trx('users').where({id: user_id}).first();

        if(isSuggestion){
          
          const result = wordFitler.isProfane(text);
          
          if(result){
            await trx.rollback();
            return response.status(400).json({
              error: 'Por favor não coloque palavras ofensivas!',
            });
          }
          const newSuggetion =  await trx('suggestions').insert({text: text, user_id: user_id});

          await trx.commit(newSuggetion);


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
}
