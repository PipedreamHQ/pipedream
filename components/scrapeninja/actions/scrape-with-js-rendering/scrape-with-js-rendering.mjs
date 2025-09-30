import { ConfigurationError } from "@pipedream/platform";
import {
  clearObj,
  parseError, parseObject,
} from "../../common/utils.mjs";
import scrapeninja from "../../scrapeninja.app.mjs";

export default {
  key: "scrapeninja-scrape-with-js-rendering",
  name: "Scrape with JS Rendering",
  description: "Uses the ScrapeNinja real Chrome browser engine to scrape pages that require JS rendering. [See the documentation](https://scrapeninja.net/docs/api-reference/scrape-js/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scrapeninja,
    url: {
      propDefinition: [
        scrapeninja,
        "url",
      ],
    },
    waitForSelector: {
      propDefinition: [
        scrapeninja,
        "waitForSelector",
      ],
      optional: true,
    },
    postWaitTime: {
      propDefinition: [
        scrapeninja,
        "postWaitTime",
      ],
      optional: true,
    },
    dumpIframe: {
      propDefinition: [
        scrapeninja,
        "dumpIframe",
      ],
      optional: true,
    },
    waitForSelectorIframe: {
      propDefinition: [
        scrapeninja,
        "waitForSelectorIframe",
      ],
      optional: true,
    },
    extractorTargetIframe: {
      propDefinition: [
        scrapeninja,
        "extractorTargetIframe",
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
    retryNum: {
      propDefinition: [
        scrapeninja,
        "retryNum",
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
    textNotExpected: {
      propDefinition: [
        scrapeninja,
        "textNotExpected",
      ],
      optional: true,
    },
    statusNotExpected: {
      propDefinition: [
        scrapeninja,
        "statusNotExpected",
      ],
      optional: true,
    },
    blockImages: {
      propDefinition: [
        scrapeninja,
        "blockImages",
      ],
      optional: true,
    },
    blockMedia: {
      propDefinition: [
        scrapeninja,
        "blockMedia",
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
    catchAjaxHeadersUrlMask: {
      propDefinition: [
        scrapeninja,
        "catchAjaxHeadersUrlMask",
      ],
      optional: true,
    },
    viewportWidth: {
      propDefinition: [
        scrapeninja,
        "viewportWidth",
      ],
      optional: true,
    },
    viewportHeight: {
      propDefinition: [
        scrapeninja,
        "viewportHeight",
      ],
      optional: true,
    },
    viewportDeviceScaleFactor: {
      propDefinition: [
        scrapeninja,
        "viewportDeviceScaleFactor",
      ],
      optional: true,
    },
    viewportHasTouch: {
      propDefinition: [
        scrapeninja,
        "viewportHasTouch",
      ],
      optional: true,
    },
    viewportIsMobile: {
      propDefinition: [
        scrapeninja,
        "viewportIsMobile",
      ],
      optional: true,
    },
    viewportIsLandscape: {
      propDefinition: [
        scrapeninja,
        "viewportIsLandscape",
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
    try {
      const viewport = clearObj({
        width: this.viewportWidth,
        height: this.viewportHeight,
        deviceScaleFactor: this.viewportDeviceScaleFactor,
        hasTouch: this.viewportHasTouch,
        isMobile: this.viewportIsMobile,
        isLandscape: this.viewportIsLandscape,
      });

      const data = clearObj({
        url: this.url,
        waitForSelector: this.waitForSelector,
        postWaitTime: this.postWaitTime,
        dumpIframe: this.dumpIframe,
        waitForSelectorIframe: this.waitForSelectorIframe,
        extractorTargetIframe: this.extractorTargetIframe,
        headers: parseObject(this.headers),
        retryNum: this.retryNum,
        geo: this.geo,
        proxy: this.proxy,
        timeout: this.timeout,
        textNotExpected: parseObject(this.textNotExpected),
        statusNotExpected: parseObject(this.statusNotExpected),
        blockImages: this.blockImages,
        blockMedia: this.blockMedia,
        screenshot: this.screenshot,
        catchAjaxHeadersUrlMask: this.catchAjaxHeadersUrlMask,
        extractor: this.extractor,
      });

      if (Object.entries(viewport).length) {
        data.viewport = viewport;
      }

      const response = await this.scrapeninja.scrapeJs({
        $,
        data,
      });

      $.export("$summary", `Successfully scraped ${this.url} with JS rendering`);
      return response;
    } catch ({ response: { data } }) {
      throw new ConfigurationError(parseError(data));
    }
  },
};
