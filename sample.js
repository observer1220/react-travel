const puppeteer = require("puppeteer");

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // 登入
    await page.setViewport({ width: 0, height: 0});
    await page.goto("http://localhost:3000/signin");
    await page.type('#basic_username', 'duck@gmail.com')
    await page.type('#basic_password', 'test1234')
    await page.click('button[type=submit]')
    await page.waitForNavigation();

    // 新增待辦事項
    await page.goto("http://localhost:3000/todolist");
    await page.click('#add')
    await page.select('select[name="category"]', '中')
    await page.type('input[name="EstEndDate"]', '2022年10月26日')
    await page.type('input[name="todos"]', '安排待辦事項')
    await page.type('input[name="remarks"]', 'test')
    // await page.click('checkbox[name="trustee"]', 'Jack')
    await page.type('input[name="phone"]', '0980251309')
    // await delay(5000)
    await page.click('#root > div > section > main > div > div > div > ui5-dialog:nth-child(6) > ui5-bar:nth-child(1) > ui5-button:nth-child(1)')
    await browser.close();
})()