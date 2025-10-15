import app from "../../airslate.app.mjs";

export default {
  key: "airslate-create-new-template",
  name: "Create a New Template",
  description: "Create a new reusable document package that contains fillable documents and forms in the specified organization. [See the documentation](https://docs.airslate.io/docs/airslate-api/templates-api%2Foperations%2Fcreate-a-organization-template)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      optional: true,
    },
    redirectUrl: {
      propDefinition: [
        app,
        "redirectUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createTemplate({
      $,
      organizationId: this.organizationId,
      data: {
        name: this.name,
        description: this.description,
        redirect_url: this.redirectUrl,
      },
    });

    if (response?.id) {
      $.export("$summary", `Created new template in organization ${this.organizationId}`);
    }

    return response;
  },
};
