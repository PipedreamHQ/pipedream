import app from "../../apiary.app.mjs";

export default {
  key: "apiary-publish-blueprint",
  name: "Publish Blueprint",
  description: "Publish an API Blueprint for a particular API. [See the documentation](https://apiary.docs.apiary.io/#reference/blueprint/publish-blueprint/publish-blueprint)",
  version: "0.0.1",
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
    const response = await this.app.publishBlueprint({
      $,
      apiSubdomain: this.apiSubdomain,
    });

    $.export("$summary", `Successfully published the blueprint with the subdomain '${this.apiSubdomain}'`);

    return response;
  },
};
