import gmail from "../../gmail.app.mjs";
import labelColors from "../../common/label-colors.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-create-label",
  name: "Create Label",
  description: "Create a new label in the connected account. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/create)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    name: {
      type: "string",
      label: "Name",
      description: "The display name of the label",
    },
    textColor: {
      type: "string",
      label: "Text Color",
      description: "The text color of the label",
      options: labelColors,
      optional: false,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "The background color of the label",
      options: labelColors,
      optional: false,
    },
    messageListVisibility: {
      type: "string",
      label: "Message List Visibility",
      description: "The visibility of messages with this label in the message list in the Gmail web interface",
      options: [
        "show",
        "hide",
      ],
      optional: true,
    },
    labelListVisibility: {
      type: "string",
      label: "Label List Visibility",
      description: "The visibility of the label in the label list in the Gmail web interface",
      options: [
        "labelShow",
        "labelShowIfUnread",
        "labelHide",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gmail._client().users.labels.create({
      userId: constants.USER_ID,
      requestBody: {
        name: this.name,
        messageListVisibility: this.messageListVisibility,
        labelListVisibility: this.labelListVisibility,
        color: {
          textColor: this.textColor,
          backgroundColor: this.backgroundColor,
        },
      },
    });
    $.export("$summary", `Successfully created label: ${this.name}`);
    return response;
  },
};
