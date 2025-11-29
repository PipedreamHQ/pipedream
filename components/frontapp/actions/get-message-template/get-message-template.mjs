import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-message-template",
  name: "Get Message Template",
  description: "Fetch a message template. [See the documentation](https://dev.frontapp.com/reference/get-message-template)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    frontapp,
    messageTemplateId: {
      propDefinition: [
        frontapp,
        "messageTemplateId",
      ],
    },
  },
  async run({ $ }) {
    const messageTemplate = await this.frontapp.getMessageTemplate({
      $,
      messageTemplateId: this.messageTemplateId,
    });

    $.export("$summary", `Successfully retrieved message template with ID: ${this.messageTemplateId}`);

    return messageTemplate;
  },
};
