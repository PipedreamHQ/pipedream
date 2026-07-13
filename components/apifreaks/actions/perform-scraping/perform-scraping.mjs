import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-perform-scraping",
  name: "Perform Web Scraping With Custom Instructions",
  description: "Execute a series of web scraping instructions on a target URL.  Supports various operations like form filling, clicking, data extraction, and CAPTCHA solving. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "Url",
      description: "Target URL to scrape",
      optional: false,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Set to `true` to return the data in text format else `false` for data in html format with tags.",
      optional: true,
    },
    jsEnabled: {
      type: "string",
      label: "Jsenabled",
      description: "Set `true` to enable JavaScript rendering for dynamic pages. Set `false` for static HTML pages.    Default value is `false`.",
      optional: true,
    },
    proxy: {
      type: "string",
      label: "Proxy",
      description: "Use proxy for requests. Can be `true`/`false`, a proxy URL string, or a proxy configuration object.",
      optional: true,
    },
    sslIgnore: {
      type: "string",
      label: "Sslignore",
      description: "Ignore SSL certificate errors.    Only works if **jsEnabled** is **true**.",
      optional: true,
    },
    windowSize: {
      type: "string",
      label: "Windowsize",
      description: "Specify the browser window size in the format 'width,height' (e.g., \"1920w,1080h\"). Default value is the default resolutions provided by web/browser.    Only works if **jsEnabled** is **true**.",
      optional: true,
    },
    adBlock: {
      type: "string",
      label: "Adblock",
      description: "Set to `true` to apply ad-blocker to the specified URL else false or ignore to not apply.    Only works if **jsEnabled** is **true**.",
      optional: true,
    },
    captcha: {
      type: "string",
      label: "Captcha",
      description: "if true user can provide captcha instructions in the instructions to solve image captchas.     Only works if **jsEnabled** is **true**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/scraping",
      params: {
        url: this.url,
        text: this.text,
        jsEnabled: this.jsEnabled,
        proxy: this.proxy,
        sslIgnore: this.sslIgnore,
        windowSize: this.windowSize,
        adBlock: this.adBlock,
        captcha: this.captcha,
      },
    });
    $.export("$summary", "Successfully executed Perform Web Scraping With Custom Instructions");
    return response;
  },
};
