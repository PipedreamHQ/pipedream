import common from "../../common/verify-client-id.mjs";

export default {
  ...common,
  key: "gmail-add-label-to-email",
  name: "Add Label to Email",
  description: "Add a label to an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    message: {
      propDefinition: [
        common.props.gmail,
        "message",
      ],
    },
    label: {
      propDefinition: [
        common.props.gmail,
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
