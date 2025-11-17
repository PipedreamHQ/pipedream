# `@pipedream/browsers` package

This package abstracts the exact version pinning required for [`puppeteer`](https://www.npmjs.com/package/puppeteer) & [`playwright`](https://www.npmjs.com/package/playwright) to function properly in Pipedream code steps.

The `index.mjs` file reexports the specific pinned versions of `puppeteer-core` & `playwright` that are compatible with the same Chromium version that is compatible with Lambda.

The reason this package is required is because npm package versions can't be pinned in both `playwright.app.mjs` as an in-JS pin _and_ pin over the `playwright/package.json`.

Therefore, it's not possible to offer both the pinned versions of [`@sparticuz/chromium`](https://www.npmjs.com/package/@sparticuz/chromium) & `playwright` in both pre-built actions & in Node.js code steps.

## Usage

This package exports two modules: `puppeteer` & `playwright`. Both modules share the same interface:

* `browser(opts?)` - method to instantiate a new browser (returns a browser instance)
* `launch(opts?)` - an alias to `browser()`
* `newPage()` - creates a new page instance and returns both the `page` & `browser`

**Note**: After awaiting the browser instance with either `puppeteer` or `playwright`, make sure to close the browser at the end of your Node.js code step.

### Puppeteer

```javascript
import { puppeteer } from '@pipedream/browsers';

export default defineComponent({
  async run({steps, $}) {
    const browser = await puppeteer.browser();
    
    console.log(browser)
    // get page, perform actions, etc.

    await browser.close();
  },
})
```

### Playwright

```javascript
import { playwright } from '@pipedream/browsers';

export default defineComponent({
  async run({steps, $}) {
    const browser = await puppeteer.browser();
    const page = await browser.newPage();

    page.goto('https://pipedream.com');
    const title = await page.title()


    // Puppeteer requires you to close page context's before closing the browser itself
    // otherwise, the code step's execution will hang
    await page.context().close();
    await browser.close();
  },
})
```

## Additional Resources

* Compatibility Table for Chromium <> Puppeteer version support here: https://pptr.dev/chromium-support
* Compatibility Table for Chromium <> Playwright versions can be found here: https://www.browserstack.com/docs/automate/playwright/browsers-and-os

The reason why Playwright is locked to an old version is because the latest Puppeteer Chromium version that works in a code step is chromium@121.
