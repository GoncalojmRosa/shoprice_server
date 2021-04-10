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

export default async function DataCollect(data: Data) {

        try {
            if(data.Supermarket == "Pingo Doce" && data.filter != undefined){
                let buyingPrice, firstName, sku
                const fetchedData = await fetch(data.secondUrl + data.product + data.filterCategory + data.filter + data.secondFilterCategory)
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error("Bad response from server");
                    }
                    return res.json();
                })
                .then(prod => {
                    //@ts-ignore
                        buyingPrice = prod.sections[data.product].products[0]._source.buyingPrice;
                        firstName = prod.sections[data.product].products[0]._source.firstName;
                        sku = prod.sections[data.product].products[0]._source.sku;
                        return {
                            title: data.Supermarket, 
                            name: firstName, 
                            price: buyingPrice, 
                            img: data.secondImgPath + sku + "_1", 
                            url: data.url + data.product
                        };
                    })
                    .catch(err => {
                        console.error(err);
                    });

                    return fetchedData
                }else{
                    // console.log(data)
                    const browser = await puppeteer.launch({
                        headless: true,
                    });
            
                    const page = await browser.newPage();
                    
                    if(data.filter != undefined && data.Supermarket != "Pingo Doce"){
                        await page.goto(data.url + data.product + data.filter, {
                            waitUntil: 'domcontentloaded'
                        });
                        
                    }else{
                        await page.goto(data.url + data.product, {
                            waitUntil: 'domcontentloaded'
                        });
                    }
            
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
                    //@ts-ignore
                    // const scrapedData = await page.evaluate(
                    //   () =>
                    //   Array.from(document.querySelectorAll('.productItem .productBoxTop .containerDescription .title a')).map((link) => ({
                    //     title: link.innerHTML,
                    //     // price: link.innerHTML,
                    //   }))
                    // );
            
                    // var a = lamudiNewPropertyCount
            
                    
                    
                    // await page.close();
                    // await browser.close();
                    
                    // console.log('scrapedData', lamudiNewPropertyCount);
                    name = name.replace(/\s+/g,' ').trim();
                    // i = name.replace(/\s+/g,' ').trim();
                    price = price.replace(/\s+/g,' ').trim();
                    await page.close();
                    await browser.close();
                    return {title: supermarketName , name, price, img, url: data.url + data.product};
            }


            
        } catch (error) {
            console.log(error)
        }
}
