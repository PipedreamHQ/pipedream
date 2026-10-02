import app from "../../linkup.app.mjs";

export default {
  name: "Linkup Fetch",
  description: "Fetch a web page and return its content as clean markdown using the Linkup API. [See the documentation](https://docs.linkup.so/pages/documentation/endpoints/fetch/reference)",
  key: "linkup-fetch",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    renderJs: {
      propDefinition: [
        app,
        "renderJs",
      ],
    },
    includeRawHtml: {
      propDefinition: [
        app,
        "includeRawHtml",
      ],
    },
    extractImages: {
      propDefinition: [
        app,
        "extractImages",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.fetch({
      url: this.url,
      renderJs: this.renderJs,
      includeRawHtml: this.includeRawHtml,
      extractImages: this.extractImages,
    });
    $.export("$summary", `Successfully fetched ${this.url}`);
    return response;
  },
};
