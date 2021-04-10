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

        try {
            // console.log(data)
            const browser = await puppeteer.launch({
                headless: true,
            });
    
            const page = await browser.newPage();
            
            await page.goto(data.url + data.product, {
                waitUntil: 'domcontentloaded'
            });
    
            await page.waitForXPath(data.XPath)

            let productName = await page.$x(data.NameXPath)
            
            let productImg = await page.$x(data.ImgXPath)

            let productPrice = await page.$x(data.PriceXPath)

            let supermarketName = data.Supermarket;

            let name = await page.evaluate(el => el.textContent, productName[0])
                .then((data) =>{
                    return data;
                }
                )
                .catch((err) => {
                    console.log(err)
                });
            
            let img = await page.evaluate(el => el.textContent, productImg[0])
                .then((data) =>{
                    return data;
                }
                )
                .catch((err) => {
                    console.log(err)
                });

            let price = await page.evaluate(el => el.textContent, productPrice[0])
            .then((data) =>{
                return data;
            }
            )
            .catch((err) => {
                console.log(err)
            });
           
            name = name.replace(/\s+/g,' ').trim();
            price = price.replace(/\s+/g,' ').trim();
            await page.close();
            await browser.close();
            return {title: supermarketName , name, price, img, url: data.url + data.product};

            
        } catch (error) {
            console.log(error)
        }
}
