import puppeteer from 'puppeteer';
import fetch from "node-fetch";


interface Data{
    Supermarket: string
    product: string,
    url?: string,
    XPath: string
    NameXPath: string
    PriceXPath: string
    ImgXPath: string
    filterCategory?: string // filter for Pingo Doce WebSite (ONLY)
    secondUrl?: string,
    secondFilterCategory?: string
    filter?: string,
    secondImgPath?: string
}

export default async function fasterDataCollect(data: Data) {
    // console.log(data)
        try {
            // console.log(data)
            const browser = await puppeteer.launch({
                headless: true
                // pipe: true
            });
    
            const page = await browser.newPage();
            
            const a = data.url + data.product
            // console.log(a)
            // console.log(data.url + a[0] + '+' + a[1])
            // console.log(data.product[1])
            await page.goto(a, {
                waitUntil: 'load'
            });
            // await page.screenshot({
            //     path: 'example'+ Math.floor(Math.random() * 10) + '.png',
            //   });
    
            const isShowed = await page.waitForXPath(data.XPath)

            if(isShowed){

                let productName = await page.$x(data.NameXPath)
                
                let productImg = await page.$x(data.ImgXPath)
    
                let productPrice = await page.$x(data.PriceXPath)
    
                let supermarketName = data.Supermarket;
    
                let name = await page.evaluate(el => el.textContent, productName[0]);
      
                // console.log(productImg[0])
    
                let img = await page.evaluate(el => el.textContent, productImg[0]);
    
                let price = await page.evaluate(el => el.textContent, productPrice[0]);
               
                name = name.replace(/\s+/g,' ').trim();
                price = price.replace(/\s+/g,' ').trim();
                await page.close();
                await browser.close();
                return {title: supermarketName , name, price, img, url: data.url + data.product};
            }

            return null
            
        } catch (error) {
            console.log(error)
        }
}
