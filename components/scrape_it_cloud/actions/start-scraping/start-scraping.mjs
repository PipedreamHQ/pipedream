import app from "../../scrape_it_cloud.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "scrape_it_cloud-start-scraping",
  name: "Start Scraping",
  description: "Initiate the scraping process for a specific endpoint. [See the documentation here](https://scrape-it.cloud/docs/api-features/basic-request).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "Specify the URL of the web page you would like to scrape.",
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Specify custom HTTP headers to be passed to the request. For example, in order to override the User-Agent header, use `User-Agent` as a key and `Teapot` as a value.",
      optional: true,
    },
    blockResources: {
      type: "boolean",
      label: "Block Resources",
      description: "By default Scrape-it.cloud do not block images and CSS in the scraped page. To speed up requests and block images and CSS set this parameter value to true.",
      optional: true,
    },
    blockUrls: {
      type: "string[]",
      label: "Block URLs",
      description: "If you want to block some resources except images and CSS, for example, analytics scripts you can add part of the urls to be blocked. Follow [Blocking URLs](https://scrape-it.cloud/docs/api-features/blocking-urls) page to get more information.",
      optional: true,
    },
    wait: {
      type: "integer",
      label: "Wait",
      description: "Some websites may use javascript frameworks that may require a few extra seconds to load their content. This parameters specifies the time in milliseconds to wait for the website. Recommended values are in the interval `5000` - `10000`.",
      optional: true,
    },
    waitFor: {
      type: "string",
      label: "Wait For",
      description: "Specify a CSS selector and the API will wait 30 seconds until the selector appears.",
      optional: true,
    },
    screenshot: {
      type: "boolean",
      label: "Screenshot",
      description: "If you want to get a screenshot of the page you want to scrape, set screenshot parameter value to `true`.",
      optional: true,
    },
    jsScenario: {
      type: "string[]",
      label: "JS Scenario",
      description: "If you want to do some acts on the pages you want to scrape, for example, go to the next one, set JavaScript scenario to API call. Follow [JavaScript Execution](https://scrape-it.cloud/docs/api-features/javascript-execution) page to get more information.",
      optional: true,
    },
  },
  methods: {
    scrape(args = {}) {
      return this.app.post({
        path: "/scrape",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      url, headers, blockResources, blockUrls, wait, waitFor, screenshot, jsScenario,
    } = this;

    const response = await this.scrape({
      step,
      data: {
        url,
        headers: utils.parse(headers),
        block_resources: blockResources,
        block_urls: utils.parseArray(blockUrls),
        wait,
        wait_for: waitFor,
        screenshot,
        js_scenario: utils.parseArray(jsScenario)?.map(utils.parse),
      },
    });

    step.export("$summary", `Successfully scraped ${url}.`);

    return response;
  },
};
