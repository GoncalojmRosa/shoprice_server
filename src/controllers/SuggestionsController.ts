import { Request, Response } from 'express';
import db from '../database/connections';
import filter from 'bad-words';
import wordsEng from '../config/bad-wordsEng';
import wordsPt from '../config/bad-wordsPt';

var wordFitler = new filter()
wordFitler.addWords(...wordsEng())
wordFitler.addWords(...wordsPt())


export default class SuggestionsController {
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

  async indexAll(request: Request, response: Response) {
    const suggestions = await db('suggestions').select('*');
    const comments = await db('comments').select('*');
    const trx = await db.transaction();
    try {
      const users = await trx('users').select('name', 'avatar', 'id');
  
      const commentsFormated = comments.map(comment => ({
        ...comment,
        user: users.filter(u => u.id === comment.user_id)[0]
      }));
  
      const sugFormated = suggestions.map(sug => ({
        ...sug,
        user: users.filter(user => user.id === sug.user_id)[0],
        comments: commentsFormated.filter(c => c.suggestion_id === sug.id)
      }));
  
      await trx.commit();
      return response.json(sugFormated);
      
    } catch (error) {
      console.log(error);
      await trx.rollback();
      return response.status(400).json({
          err: 'Unexpected error while creating new Schedule',
      });
    }
  }

  async create(request: Request, response: Response) {
    const { text, user_id } = request.body;

    const trx = await db.transaction();

    console.log(request.body)

    try {
        const isSuggestion = await trx('users').where({id: user_id}).first();

        if(isSuggestion){
          
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

  async getSuggestionByUserId(request: Request, response: Response) {
    const {id} = request.body;

    // console.log(request.body)
    const trx = await db.transaction();

    try {
      const anyUser = await trx('users').where({id: id}).first();


      if(anyUser){
        const suggestions = await trx('suggestions').where({user_id: anyUser.id});
        const comments = await trx('comments').select('*');
        const users = await trx('users').select('name', 'avatar', 'id');

        // const specificComment = await trx('comments')
        // .innerJoin('suggestions', 'comments.suggestion_id', 'suggestions.id')
        // .innerJoin('users', 'suggestions.user_id', 'users.id')
        // .select('users.name', 'users.avatar','comments.*', 'suggestions.*')
        // .where('suggestions.user_id','=',id)


        // console.log(specificComment)
        // //User that comment
        // const commentUser = await trx('users').where({id: suggestions[0].user_id}).first();

        const commentsFormated = comments.map(comment => ({
          ...comment,
          user: users.filter(u => u.id === comment.user_id)[0]
        }));
        
        const suggestionsFormated = suggestions.map(s => {
          return {
            ...s,
            user: users.filter(user => user.id === s.user_id)[0],
            comments: commentsFormated.filter(c => c.suggestion_id === s.id)
          };
        });

        // const suggestionsFormated = suggestions.map(s => {
        //   return {
        //     ...s,
        //     comments: comments.filter(c => c.suggestion_id === s.id),
        //     // name: specificComment,
        //     // avatar: specificComment
        //   }
        // })
        await trx.commit();
        return response.json(suggestionsFormated)
      }else{
        await trx.rollback();
        return response.status(400).json({
            error: 'Something bad happened',
        });
      }
    } catch (error) {
      console.log(error);
      await trx.rollback();
      return response.status(400).json({
          err: 'Unexpected error while creating new Schedule',
      });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.body;

    console.log(request.body)

    const trx = await db.transaction();

    try {
      const isSuggestion = await trx('suggestions').where({id: id}).first();
      if(isSuggestion){
        const comments = await trx('comments').where({suggestion_id: id});
        if(comments){
          await trx('comments').delete().where({suggestion_id: id});
        }


        const deletedReport =  await trx('suggestions').delete().where({id: id});

        await trx.commit(deletedReport);


        return response.json();
      }else{
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while deleting Suggestion',
        });
      }

    } catch (err) {
        console.log(err);
        await trx.rollback();
        return response.status(400).json({
            err: 'Unexpected error while deleting Suggestion',
        });
    }
  }
}
