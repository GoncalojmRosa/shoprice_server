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
            const user = await trx('users').select('*').where('id', user_id).first();

            if(user.warnings === 3){
              if(user.role === 'admin'){
                await trx.rollback();
                return response.status(400).json({
                  error: 'Por favor não coloque palavras ofensivas!',
                });
              }else if(user.role === 'demo'){
                await trx.rollback();
                return response.status(400).json({
                  error: 'Por favor não coloque palavras ofensivas!',
                });
              }
              await trx('users').update({badge: 'Banned'}).where('id',user_id);
              await trx.commit();
              return response.status(400).json({
                status: 'Banned',
                error: 'Pedimos desculpa mas a sua conta foi Banida do nosso Site!',
              });
            }

            await trx('users').update({warnings: user.warnings + 1}).where('id',user_id);
            
            await trx.commit();

            await trx.rollback();
            return response.status(400).json({
              error: 'Por favor não coloque palavras ofensivas!',
            });
          }
            
          await trx('comments').insert({text: text, user_id: user_id, suggestion_id: suggestion_id});

          await trx.commit();


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
