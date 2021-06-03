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

        const { Name, url, XPath, ImgXPath, NameXPath, PriceXPath, filterCategory, secondUrl,secondFilterCategory } = request.body;

        const trx = await db.transaction();

        try {
            const site = await trx('websites').where({url}).first();

            if(!site){

                const siteCreated =  await trx('websites').insert({
                    Name,
                    url,
                    XPath,
                    ImgXPath,
                    NameXPath,
                    PriceXPath,
                    filterCategory,
                    secondUrl,
                    secondFilterCategory
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

        const { product, Category } = request.body;

        console.log(request.body)

        const trx = await db.transaction();

        try {
            const site = await trx('websites').select('*')

            if(site){
                console.log(Category)
                if(Category === undefined || Category == ''){

                    // console.log(category)
                    
                    let results: any[] = ['']
    
                    for(var i = 0; i<site.length; i++){
    
                        results[i] = await DataCollect({
                                Supermarket: site[i].Name,
                                product: product, 
                                url: site[i].url, 
                                XPath: site[i].XPath, 
                                ImgXPath: site[i].ImgXPath,
                                NameXPath: site[i].NameXPath,
                                PriceXPath: site[i].PriceXPath,
                            })
    
                    }
                    await trx.commit();
    
                    let data: any[] = []
                    for (let i = 0; i < site.length; i++) {
    
                        data[i] = results[i]
                    }
    
                    return response.json(data)
                }else{
                    let results: any[] = ['']
                    let dataCat: any[] = ['']
                    
                    dataCat = await trx('categories').select('queryString').where({name: Category}).orderBy('website_id')
                    
                    for(var i = 0; i<site.length; i++){

                        results[i] = await DataCollect({
                                Supermarket: site[i].Name,
                                product: product, 
                                url: site[i].url, 
                                XPath: site[i].XPath, 
                                ImgXPath: site[i].ImgXPath,
                                NameXPath: site[i].NameXPath,
                                PriceXPath: site[i].PriceXPath,
                                filter: dataCat[i].queryString, // FILTER FOR ALL WEBSITES IM GENERAL
                                filterCategory: site[i].filterCategory,
                                secondUrl: site[i].secondUrl,
                                secondFilterCategory: site[i].secondFilterCategory,
                                secondImgPath: site[i].secondImgPath
                            })
                    }
                    await trx.commit();
                    
                    let data: any[] = []
                    for (let i = 0; i < site.length; i++) {
                        
                            data[i] = results[i]
                        }
                    return response.json(data)
    
    
                }
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