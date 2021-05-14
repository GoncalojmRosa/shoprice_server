import { Request, Response } from 'express';
import db from '../database/connections';
import filter from 'bad-words';
const wordsEng = require('../config/bad-wordsEng.json')
const wordsPt = require('../config/bad-wordsPt.json')

var wordFitler = new filter()
wordFitler.addWords(...wordsEng)
wordFitler.addWords(...wordsPt)

export default class CommentsController {
  async index(request: Request, response: Response) {
    const comments = await db('comments').select('*');

    return response.json(comments);
  }

  async create(request: Request, response: Response) {
    const { text, user_id, suggestion_id } = request.body;

    const trx = await db.transaction();

    try {
        const isUser = await trx('users').where({id: user_id}).first();
        const isSuggestion = await trx('suggestions').where({id: suggestion_id}).first();

        if(isSuggestion && isUser){

          const result = wordFitler.isProfane(text);
          
          if(result){
            await trx.rollback();
            return response.status(400).json({
              error: 'Por favor não coloque palavras ofensivas!',
            });
          }
          const newComment =  await trx('comments').insert({text: text, user_id: user_id, suggestion_id: suggestion_id});

          await trx.commit(newComment);


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
