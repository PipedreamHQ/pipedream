import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-add-label-to-email",
  name: "Add Label to Email",
  description: "Add label(s) to an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
  version: "0.0.14",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    message: {
      propDefinition: [
        gmail,
        "message",
      ],
    },
    addLabelIds: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
    },
  },
  async run({ $ }) {
    const {
      gmail,
      message,
      addLabelIds = [],
    } = this;

    const response = await gmail.updateLabels({
      message,
      addLabelIds,
    });

    $.export("$summary", `Successfully added ${addLabelIds.length} label(s)`);
    return response;
  },
};
