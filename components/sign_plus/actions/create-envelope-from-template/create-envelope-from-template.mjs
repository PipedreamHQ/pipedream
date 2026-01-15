import sign_plus from "../../sign_plus.app.mjs";

export default {
  key: "sign_plus-create-envelope-from-template",
  name: "Create Envelope From Template",
  description: "Creates a new envelope from a template. [See the documentation](https://apidoc.sign.plus/api-reference/endpoints/signplus/create-new-envelope-from-template)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sign_plus,
    templateId: {
      propDefinition: [
        sign_plus,
        "templateId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the envelope",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment for the envelope",
      optional: true,
    },
    sandbox: {
      type: "boolean",
      label: "Sandbox",
      description: "Whether the envelope is created in sandbox mode",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sign_plus.createEnvelopeFromTemplate({
      $,
      templateId: this.templateId,
      data: {
        name: this.name,
        comment: this.comment,
        sandbox: this.sandbox,
      },
    });
    $.export("$summary", `Successfully created envelope with ID: ${response.id}`);
    return response;
  },
};
