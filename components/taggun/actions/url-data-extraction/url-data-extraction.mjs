import app from "../../taggun.app.mjs";

export default {
  key: "taggun-url-data-extraction",
  name: "URL Data Extraction",
  description: "Provide a URL for a receipt or invoice to extract clear and basic data. [See the documentation](https://developers.taggun.io/reference/url-simple)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    referenceId: {
      propDefinition: [
        app,
        "referenceId",
      ],
      optional: true,
    },
    refresh: {
      propDefinition: [
        app,
        "refresh",
      ],
    },
    near: {
      propDefinition: [
        app,
        "near",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    incognito: {
      propDefinition: [
        app,
        "incognito",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.urlDataExtraction({
      $,
      data: {
        url: this.url,
        referenceId: this.referenceId,
        refresh: this.refresh,
        near: this.near,
        language: this.language,
        incognito: this.incognito,
      },
    });
    $.export("$summary", "Successfully sent the image for processing");
    return response;
  },
};
