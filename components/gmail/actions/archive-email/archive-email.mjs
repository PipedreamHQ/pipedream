import constants from "../../common/constants.mjs";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-archive-email",
  name: "Archive Email",
  description: "Archive an email message. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify)",
  version: "0.0.8",
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
  },
  async run({ $ }) {
    const {
      gmail,
      message,
    } = this;

    const response = await gmail.updateLabels({
      message,
      removeLabelIds: [
        constants.INBOX_LABEL_ID,
      ],
    });

    $.export("$summary", `Successfully archived email (ID: ${message})`);
    return response;
  },
};
