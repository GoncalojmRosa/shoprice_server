import puppeteer from 'puppeteer';


interface Data{
    product: string,
    url?: string,
}

export default async function DataCollect(data: Data) {

        try {
            
            const browser = await puppeteer.launch({
                headless: true,
            });
    
            const page = await browser.newPage();
    
            await page.goto('https://www.continente.pt/pt-pt/public/Pages/searchresults.aspx?k=' + data.product, {
                waitUntil: 'load'
            });
    
            // await page.screenshot({
            //   path: 'example'+ Math.floor(Math.random() * 10) + '.png',
            // });
            // const example = await page.$('.contentMain');
            //
    
            await page.waitForXPath(`//*[@id="ctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783_ctl00__panelcontrol_"]/div/div/div[4]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]`)
    
            let elHandle = await page.$x(`//*[@id="ctl00_SPWebPartManager1_g_ce8bbc4a_23de_48a0_afe2_1519cb58b783_ctl00__panelcontrol_"]/div/div/div[4]/div[2]/div[2]/div[2]/div/div[1]/div/div[1]`)
    
            //@ts-ignore
            let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0])
                .then((data) =>{
                    
                    return data;
                }
                )
                .catch((err) => {
                    console.log(err)
                });
    
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
            lamudiNewPropertyCount = lamudiNewPropertyCount.replace(/\s+/g,' ').trim();
            await page.close();
            await browser.close();
            return lamudiNewPropertyCount.replace(/\n/g, '');
        } catch (error) {
            console.log(error)
        }
}
