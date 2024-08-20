import common from "../../common/verify-client-id.mjs";

export default {
  ...common,
  key: "gmail-remove-label-from-email",
  name: "Remove Label from Email",
  description: "Remove label(s) from an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    message: {
      propDefinition: [
        common.props.gmail,
        "message",
      ],
    },
    removeLabelIds: {
      propDefinition: [
        common.props.gmail,
        "messageLabels",
        (c) => ({
          messageId: c.message,
          type: "remove",
        }),
      ],
      label: "Labels To Remove",
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
