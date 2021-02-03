import db from "../database/connections";
import { Request, Response } from 'express';
import DataCollect from '../script/puppeteer'

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
                const a = await DataCollect({product: product})
                // console.log(a)
                await trx.commit();
                return response.json({Data: a});

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