import common from "../../common/verify-client-id.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "gmail-add-label-to-email",
  name: "Add Label to Email",
  description: "Add or remove labels associated with an email message. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
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
    addLabelIds: {
      propDefinition: [
        common.props.gmail,
        "messageLabels",
        (c) => ({
          messageId: c.message,
          type: "add",
        }),
      ],
      label: "Labels To Add",
      description: "The labels to add to the email",
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
      addLabelIds = [],
      removeLabelIds = [],
    } = this;

    if (!addLabelIds.length && !removeLabelIds.length) {
      throw new ConfigurationError("At least one label must be specified");
    }

    const response = await gmail.updateLabels({
      message,
      addLabelIds,
      removeLabelIds,
    });

    $.export("$summary", `Successfully added ${addLabelIds.length} and removed ${removeLabelIds.length} label(s)`);
    return response;
  },
};
