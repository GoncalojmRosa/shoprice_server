import db from "../database/connections";
import { Request, Response } from 'express';

export default class WebsitesController{

    async index(request: Request, response: Response) {

        const sites = await db('websites').select('*');

        //@ts-ignore
        return response.json(sites);
      }

    async create(request: Request, response: Response) {

        const { url, Element, Class } = request.body;

        const trx = await db.transaction();

        try {
            const site = await trx('websites').where({url}).first();

            if(!site){

                const siteCreated =  await trx('websites').insert({
                    url,
                    pageElement: Element,
                    pageElement_Class: Class
                });

                await trx.commit(siteCreated);


                return response.json();
            }else{
                await trx.rollback();
                return response.status(400).json({
                    error: 'This Website already exists!',
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

      async products(request: Request, response: Response) {

        const { product } = request.body;

        const trx = await db.transaction();

        try {
            const site = await trx('websites').select('*').then(result => result[0]);

            if(site){   

                // var spawn = require("child_process").spawn;
                // var process = await spawn('python', ["src/script/webScrapping.py"]);

                // process.stdout.on('data', function(data: any){
                //     console.log(data.toString())
                //     // return response.json(data.toString());
                // })
                var spawn = require("child_process").spawn;
                var process = spawn('python',["src/script/webScrapping.py", product]);
                
                
                
                process.stdout.on('data',function(chunk: any){

                    var textChunk = chunk.toString('utf8');// buffer to string
                    console.log(textChunk)
                });

                await trx.commit();
                return response.json();

            }else{

                await trx.rollback();
                return response.status(400).json({
                    error: 'We dont have websites working right now!',
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