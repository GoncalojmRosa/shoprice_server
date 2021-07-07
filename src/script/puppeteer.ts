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
    // console.log(data)

        try {
            if(data.Supermarket == "Pingo Doce" && data.filter != undefined){
                let buyingPrice, firstName, sku
                // console.log(data.secondUrl + data.product + data.filterCategory + data.filter + data.secondFilterCategory)
                const fetchedData = await fetch(data.secondUrl + data.product + data.filterCategory + data.filter + data.secondFilterCategory)
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error("Bad response from server");
                    }
                    return res.json();
                })
                .then(prod => {
                    //@ts-ignore
                    if(prod.sections[data.product].products[0] !== undefined){

                        buyingPrice = prod.sections[data.product].products[0]._source.buyingPrice;
                        firstName = prod.sections[data.product].products[0]._source.firstName;
                        sku = prod.sections[data.product].products[0]._source.sku;

                        // let price = buyingPrice.replace(/\s+/g,' ').trim();
                        // price = buyingPrice.replace(/,/g, '.')
                        // price = buyingPrice.replace(/[^\d.-]/g, '')
                        // price = String/

                        // buyingPrice = buyingPrice.replace(/\s+/g,' ').trim();
                        // buyingPrice = buyingPrice.replace(/,/g, '.')
                        // buyingPrice = buyingPrice.replace(/[^\d.-]/g, '')
                        // buyingPrice = String(buyingPrice)

                        buyingPrice = buyingPrice.toFixed(2);
                        buyingPrice = parseFloat(buyingPrice);

                        return {
                            title: data.Supermarket, 
                            name: firstName, 
                            price: buyingPrice, 
                            img: data.secondImgPath + sku + "_1", 
                            url: data.url + data.product
                        };
                    }
                    return null;
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
                        const a = data.url + data.product + data.filter
                        await page.goto(a, {
                            waitUntil: 'load'
                        });
                        
                    }else{
                        //ENTRA SOMENTE QUANDO NÃO EXISTE CATEGORIA
                        // console.log("jakshdjakshdsajkd")
                        if(data.Supermarket == "Auchan"){
                            await page.goto(data.url + data.product, {
                                waitUntil: 'domcontentloaded'
                            });
                        }else{

                            await page.goto(data.url + data.product, {
                                waitUntil: 'load'
                            });
                        }
                    }
            
                    const isShowed = await page.waitForXPath(data.XPath, {visible: true, hidden: true, timeout: 5000})
                    
                    if(isShowed){

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
                        price = price.replace(/,/g, '.')
                        price = price.replace(/[^\d.-]/g, '')
                        price = parseFloat(price)
                        await page.close();
                        await browser.close();
                        return {title: supermarketName , name, price, img, url: data.url + data.product};
                    }

                return null
                    
            }


            
        } catch (error) {
            console.log(error)
        }
}
