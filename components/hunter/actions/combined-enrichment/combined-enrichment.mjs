import app from "../../hunter.app.mjs";

export default {
  key: "hunter-combined-enrichment",
  name: "Combined Enrichment",
  description: "Returns all the information associated with an email address and its domain name. [See the documentation](https://hunter.io/api-documentation/v2#combined-enrichment).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
    } = this;

    const response = await app.combinedEnrichment({
      $,
      params: {
        email,
      },
    });

    $.export("$summary", "Successfully retrieved combined enrichment data");
    return response;
  },
};
