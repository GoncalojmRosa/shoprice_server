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
            const site = await trx('websites').select('*').whereBetween('id', [1, 3])

            if(site){
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
                                filter: dataCat[i].queryString, // FILTER FOR ALL WEBSITES IN GENERAL
                                filterCategory: site[i].filterCategory,
                                secondUrl: site[i].secondUrl,
                                secondFilterCategory: site[i].secondFilterCategory,
                                secondImgPath: site[i].secondImgPath
                            })
                    }
                    await trx.commit();
                    
                    let data: any[] = []
                    for (let i = 0; i < site.length; i++) {
                        // console.log(results[i])
                        if(results[i] != null){

                            data[i] = results[i]
                        }else{
                            data[i] = "Produto não encontrado! Experimente alterar a Categoria."
                        }
                        
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
                err: 'Unexpected error while searching for a Product',
            });
        }
      }

      async indexSiteById(request: Request, response: Response) {
        const {id} = request.body
        const trx = await db.transaction();
        console.log(id)
    
      try{
        const site = await trx('websites').where('id',id).first();

        console.log(site)
    
        if(site){
          await trx.commit();
          return response.json(site);
        }else{
          await trx.rollback();
          return response.status(400).json({
              error: `Something bad Happen!`,
          });
        }
      }catch(error){
        await trx.rollback();
        return response.status(400).json({
            error: 'We dont have websites working right now!',
        });
      }
    }

    async update(request: Request, response: Response) {
        
        const trx = await db.transaction();
        
        try {
            const {id} = request.body;
            const  { Name, url, XPath, ImgXPath, NameXPath, PriceXPath } = request.body;

            console.log(request.body)

            // const hashedPassword = await PasswordHash.hashPassword(password);
            
            await trx('websites').update({Name, url, XPath, ImgXPath, NameXPath, PriceXPath}).where('id',id);
            
            await trx.commit();
    
            return response.status(201).send();

        } catch (err) {

            console.log(err);
            await trx.rollback();
            
            return response.status(400).json({
            error: 'Unexpected error while updating new User',
            });

        }
    }
}