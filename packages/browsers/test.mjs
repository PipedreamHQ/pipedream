import { puppeteer } from "./index.mjs";

async function testPuppeeter() {
  const browser = await puppeteer.browser();

  console.log(browser);
  // get page, perform actions, etc.

  await browser.close();
}

testPuppeeter();
