import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-bulk-screenshot",
  name: "Capture Screenshots of Multiple Websites",
  description: "Our Bulk Screenshot API allows you to capture screenshots of multiple webpages simultaneously, saving you time and effort. Instead of manually capturing each page one by one, you can batch process URLs and receive high-quality screenshots in the format you choose. Maximum `50 URLs` per request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    urls: {
      type: "string",
      label: "Urls",
      description: "List of website URLs to capture screenshots of",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/screenshot",
      data: {
        urls: this.urls,
      },
    });
    $.export("$summary", "Successfully executed Capture Screenshots of Multiple Websites");
    return response;
  },
};
