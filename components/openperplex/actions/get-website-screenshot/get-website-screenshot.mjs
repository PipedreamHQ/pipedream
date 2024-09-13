import openperplex from "../../openperplex.app.mjs";

export default {
  key: "openperplex-get-website-screenshot",
  name: "Get Website Screenshot",
  description: "Get a screenshot of a website using Openperplex. [See the documentation](https://docs.openperplex.com/api-reference/endpoint/get-website-screenshot)",
  version: "0.0.1",
  type: "action",
  props: {
    openperplex,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to create a screenshot of",
    },
  },
  async run({ $ }) {
    const response = await this.openperplex.getWebsiteScreenshot({
      $,
      params: {
        url: this.url,
      },
    });
    $.export("$summary", "Successfully created screenshot");
    return response;
  },
};
