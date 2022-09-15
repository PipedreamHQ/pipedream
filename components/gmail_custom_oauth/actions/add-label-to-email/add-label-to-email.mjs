import gmail from "../../gmail_custom_oauth.app.mjs";

export default {
  key: "gmail_custom_oauth-add-label-to-email",
  name: "Add Label to Email",
  description: "Add a label to an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
  version: "0.0.3",
  type: "action",
  props: {
    gmail,
    message: {
      propDefinition: [
        gmail,
        "message",
      ],
    },
    label: {
      propDefinition: [
        gmail,
        "label",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.gmail.addLabelToEmail({
      message: this.message,
      label: this.label.value,
    });
    $.export("$summary", `Successfully added ${this.label.label} label to email`);
    return response;
  },
};
