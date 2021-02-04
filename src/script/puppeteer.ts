import puppeteer from 'puppeteer';


interface Data{
    product: string,
    url?: string,
    XPath: string
    NameXPath: string
    PriceXPath: string
    ImgXPath: string
}

export default async function DataCollect(data: Data) {

        try {
            
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
            return {name, price, img};
            
        } catch (error) {
            console.log(error)
        }
}
