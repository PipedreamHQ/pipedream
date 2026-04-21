import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-bulk-archive-emails",
  name: "Bulk Archive Emails",
  description: "Archive multiple emails at once. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchModify)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    messages: {
      type: "string[]",
      label: "Messages",
      description: "The IDs of the emails to archive. Maximum 1000 messages per request.",
      propDefinition: [
        gmail,
        "message",
      ],
    },
  },
  async run({ $ }) {
    await this.gmail._client().users.messages.batchModify({
      userId: constants.USER_ID,
      requestBody: {
        removeLabelIds: [
          constants.INBOX_LABEL_ID,
        ],
        ids: this.messages,
      },
    });

    $.export("$summary", `Successfully archived ${this.messages.length} emails`);
    // Nothing to return
  },
};
