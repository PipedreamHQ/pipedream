import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-delete-message-template",
  name: "Delete Message Template",
  description: "Delete a message template. [See the documentation](https://dev.frontapp.com/reference/delete-message-template).",
  version: "0.0.1",
  type: "action",
  props: {
    frontApp,
    messageTemplateId: {
      propDefinition: [
        frontApp,
        "messageTemplateId",
      ],
      description: "The message template ID",
    },
  },
  async run({ $ }) {
    const {
      frontApp,
      messageTemplateId,
    } = this;

    const response = await frontApp.deleteMessageTemplate({
      messageTemplateId,
      $,
    });

    $.export("$summary", `Successfully deleted message template ${messageTemplateId}`);
    return response;
  },
};
