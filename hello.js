const { Cluster } = require('puppeteer-cluster');

(async () => {
    // Create a cluster with 2 workers
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
        monitor: true,
        puppeteerOptions: {
          // headless: false,
          args: ['--no-sandbox']
        }
    });

    // Define a task (in this case: screenshot of page)
    await cluster.task(async ({ page, data: url }) => {
      await page.goto(url);
      await page.type('#basic_username', 'duck@gmail.com')
      await page.type('#basic_password', 'test1234')
      await page.click('button[type=submit]')
      await page.waitForNavigation();

      await page.goto("http://localhost:3000/todolist");
      await page.click('#add')
      await page.select('select[name="category"]', '高')
      await page.type('input[name="EstEndDate"]', '2022年10月29日')
      await page.type('input[name="todos"]', '採收葡萄')
      await page.type('input[name="remarks"]', 'test')
      await page.type('input[name="phone"]', '0980251309')
      await page.click('#root > div > section > main > div > div > div > ui5-dialog:nth-child(6) > ui5-bar:nth-child(1) > ui5-button:nth-child(1)')
    });

    // Add some pages to queue
    for(let i = 0; i < 10; i++) {
      cluster.queue('http://localhost:3000/signin');
    }

    // Shutdown after everything is done
    await cluster.idle();
    await cluster.close();
})();