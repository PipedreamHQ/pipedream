import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import scrapeninja from "../../scrapeninja.app.mjs";

export default {
  key: "scrapeninja-scrape-without-js",
  name: "Scrape without JS",
  description: "Use high-performance web scraping endpoint with Chrome browser TLS fingerprint, but without JavaScript execution and real browser overhead. [See the documentation](https://scrapeninja.net/docs/api-reference/scrape/)",
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
    followRedirects: {
      propDefinition: [
        scrapeninja,
        "followRedirects",
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
      const response = await this.scrapeninja.scrapeNonJs({
        $,
        data: {
          url: this.url,
          headers: parseObject(this.headers),
          retryNum: this.retryNum,
          geo: this.geo,
          proxy: this.proxy,
          followRedirects: this.followRedirects,
          timeout: this.timeout,
          textNotExpected: parseObject(this.textNotExpected),
          statusNotExpected: parseObject(this.statusNotExpected),
          extractor: this.extractor,
        },
      });
      $.export("$summary", "Successfully scraped the URL");
      return response;
    } catch ({ response: { data } }) {
      throw new ConfigurationError(data.message || data.stderr);
    }
  },
};
