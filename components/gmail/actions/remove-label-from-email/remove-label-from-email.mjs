import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-remove-label-from-email",
  name: "Remove Label from Email",
  description: "Remove label(s) from an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
  version: "0.0.2",
  type: "action",
  props: {
    gmail,
    message: {
      propDefinition: [
        gmail,
        "message",
      ],
    },
    removeLabelIds: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      description: "The labels to remove from the email",
    },
  },
  async run({ $ }) {
    const {
      gmail,
      message,
      removeLabelIds = [],
    } = this;

    const response = await gmail.updateLabels({
      message,
      removeLabelIds,
    });

    $.export("$summary", `Successfully removed ${removeLabelIds.length} label(s)`);
    return response;
  },
};
