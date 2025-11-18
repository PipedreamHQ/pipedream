import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-template",
  name: "Get Template",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve details about a specific template. [See the documentation](https://sendoso.docs.apiary.io/#reference/template-management)",
  type: "action",
  props: {
    sendoso,
    templateId: {
      propDefinition: [
        sendoso,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const { templateId } = this;

    const response = await this.sendoso.getTemplate({
      $,
      templateId,
    });

    $.export("$summary", `Successfully retrieved template ID: ${templateId}`);
    return response;
  },
};

