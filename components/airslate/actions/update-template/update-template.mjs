import app from "../../airslate.app.mjs";

export default {
  key: "airslate-update-template",
  name: "Update Template",
  description: "Update a specified template in airSlate. [See the documentation](https://docs.airslate.io/docs/airslate-api/templates-api%2Foperations%2Fmodify-a-organization-template)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
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
    templateId: {
      propDefinition: [
        app,
        "templateId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    redirectUrl: {
      propDefinition: [
        app,
        "redirectUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.modifyTemplate({
      $,
      organizationId: this.organizationId,
      templateId: this.templateId,
      data: {
        redirect_url: this.redirectUrl,
      },
    });

    $.export("$summary", `Successfully updated template with ID: ${this.templateId}`);
    return response;
  },
};
