import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-delete-email",
  name: "Delete Email",
  description: "Moves the specified message to the trash. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/trash)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    messageId: {
      propDefinition: [
        gmail,
        "message",
      ],
      label: "Message ID",
      description: "The ID of the message to delete",
    },
  },
  methods: {
    deleteEmail(opts = {}) {
      return this.gmail._client().users.messages.trash({
        userId: constants.USER_ID,
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const response = await this.deleteEmail({
      id: this.messageId,
    });
    $.export("$summary", `Deleted email (ID: ${this.messageId})`);
    return response;
  },
};
