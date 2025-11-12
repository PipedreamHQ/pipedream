import app from "../../apiary.app.mjs";

export default {
  key: "apiary-fetch-blueprint",
  name: "Fetch Blueprint",
  description: "Fetch an API Blueprint for a particular API. [See the documentation](https://apiary.docs.apiary.io/#reference/blueprint/fetch-blueprint/fetch-blueprint)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    apiSubdomain: {
      propDefinition: [
        app,
        "apiSubdomain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.fetchBlueprint({
      $,
      apiSubdomain: this.apiSubdomain,
    });

    $.export("$summary", "Successfully fetched the blueprint for the specified API Subdomain");

    return response;
  },
};
