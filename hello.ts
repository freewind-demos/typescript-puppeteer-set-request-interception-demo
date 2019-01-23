import * as puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  await page.on('request', async (request) => {
    const url = request.url();
    if (url === 'http://localhost/hello') {
      console.log('return mock response:', url);
      await request.respond({
        status: 200,
        body: 'Hello, puppeteer!'
      });
    } else {
      console.log('block other request:', url);
      request.abort();
    }
  });

  await page.goto("http://localhost/hello");
  const html = page.evaluate(() => document.body.innerHTML)
  console.log(html)

  try {
    await page.goto('http://localhost/some-other-url');
  } catch (e) {
    console.error(e);
  }

  await browser.close();
}

run();
