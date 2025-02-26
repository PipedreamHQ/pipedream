import scrapeninja from "../../scrapeninja.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapeninja-scraping-with-js-rendering",
  name: "ScrapeNinja Scraping with JS Rendering",
  description: "Uses the ScrapeNinja real Chrome browser engine to scrape pages that require JS rendering. [See the documentation](https://scrapeninja.net/docs/api-reference/scrape-js/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapeninja,
    url: {
      propDefinition: [
        scrapeninja,
        "url",
      ],
    },
    waitforselector: {
      propDefinition: [
        scrapeninja,
        "waitforselector",
      ],
      optional: true,
    },
    postwaittime: {
      propDefinition: [
        scrapeninja,
        "postwaittime",
      ],
      optional: true,
    },
    dumpiframe: {
      propDefinition: [
        scrapeninja,
        "dumpiframe",
      ],
      optional: true,
    },
    waitforselectoriframe: {
      propDefinition: [
        scrapeninja,
        "waitforselectoriframe",
      ],
      optional: true,
    },
    extractortargetiframe: {
      propDefinition: [
        scrapeninja,
        "extractortargetiframe",
      ],
      optional: true,
    },
    headers: {
      propDefinition: [
        scrapeninja,
        "headers",
      ],
      optional: true,
    },
    retrynum: {
      propDefinition: [
        scrapeninja,
        "retrynum",
      ],
      optional: true,
    },
    geo: {
      propDefinition: [
        scrapeninja,
        "geo",
      ],
      optional: true,
    },
    proxy: {
      propDefinition: [
        scrapeninja,
        "proxy",
      ],
      optional: true,
    },
    timeout: {
      propDefinition: [
        scrapeninja,
        "timeout",
      ],
      optional: true,
    },
    textnotexpected: {
      propDefinition: [
        scrapeninja,
        "textnotexpected",
      ],
      optional: true,
    },
    statusnotexpected: {
      propDefinition: [
        scrapeninja,
        "statusnotexpected",
      ],
      optional: true,
    },
    blockimages: {
      propDefinition: [
        scrapeninja,
        "blockimages",
      ],
      optional: true,
    },
    blockmedia: {
      propDefinition: [
        scrapeninja,
        "blockmedia",
      ],
      optional: true,
    },
    screenshot: {
      propDefinition: [
        scrapeninja,
        "screenshot",
      ],
      optional: true,
    },
    catchajaxheadersurlmask: {
      propDefinition: [
        scrapeninja,
        "catchajaxheadersurlmask",
      ],
      optional: true,
    },
    viewportWidth: {
      propDefinition: [
        scrapeninja,
        "viewportwitdh",
      ],
      optional: true,
    },
    viewportHeight: {
      propDefinition: [
        scrapeninja,
        "viewportheight",
      ],
      optional: true,
    },
    viewportDeviceScaleFactor: {
      propDefinition: [
        scrapeninja,
        "viewportdevicescalefactor",
      ],
      optional: true,
    },
    viewportHasTouch: {
      propDefinition: [
        scrapeninja,
        "viewporthastouch",
      ],
      optional: true,
    },
    viewportIsMobile: {
      propDefinition: [
        scrapeninja,
        "viewportismobile",
      ],
      optional: true,
    },
    viewportIsLandscape: {
      propDefinition: [
        scrapeninja,
        "viewportislandscape",
      ],
      optional: true,
    },
    extractor: {
      propDefinition: [
        scrapeninja,
        "extractor",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const viewport = {
      width: this.viewportWidth,
      height: this.viewportHeight,
      deviceScaleFactor: this.viewportDeviceScaleFactor,
      hasTouch: this.viewportHasTouch,
      isMobile: this.viewportIsMobile,
      isLandscape: this.viewportIsLandscape,
    };

    const response = await this.scrapeninja.scrapeJs({
      url: this.url,
      waitForSelector: this.waitforselector,
      postWaitTime: this.postwaittime,
      dumpIframe: this.dumpiframe,
      waitForSelectorIframe: this.waitforselectoriframe,
      extractorTargetIframe: this.extractortargetiframe,
      headers: this.headers,
      retryNum: this.retrynum,
      geo: this.geo,
      proxy: this.proxy,
      timeout: this.timeout,
      textNotExpected: this.textnotexpected,
      statusNotExpected: this.statusnotexpected,
      blockImages: this.blockimages,
      blockMedia: this.blockmedia,
      screenshot: this.screenshot,
      catchAjaxHeadersUrlMask: this.catchajaxheadersurlmask,
      viewport,
      extractor: this.extractor,
    });

    $.export("$summary", `Successfully scraped ${this.url} with JS rendering`);
    return response;
  },
};
