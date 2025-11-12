import app from "../../apiary.app.mjs";

export default {
  key: "apiary-publish-blueprint",
  name: "Publish Blueprint",
  description: "Publish an API Blueprint for a particular API. [See the documentation](https://apiary.docs.apiary.io/#reference/blueprint/publish-blueprint/publish-blueprint)",
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
    code: {
      propDefinition: [
        app,
        "code",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.publishBlueprint({
      $,
      apiSubdomain: this.apiSubdomain,
      data: {
        code: this.code,
      },
    });

    $.export("$summary", `Successfully published the blueprint with the subdomain '${this.apiSubdomain}'`);

    return response;
  },
};
