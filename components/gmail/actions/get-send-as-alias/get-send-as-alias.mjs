import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-get-send-as-alias",
  name: "Get Send As Alias",
  description: "Get a send as alias for the authenticated user. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.sendAs/get)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
    sendAsEmail: {
      type: "string",
      label: "Send As Email",
      description: "The email address of the send as alias to get",
      async options() {
        const { sendAs } = await this.gmail.listSignatures();
        return sendAs.map(({ sendAsEmail }) => sendAsEmail);
      },
    },
  },
  async run({ $ }) {
    const { data } = await this.gmail._client().users.settings.sendAs.get({
      userId: constants.USER_ID,
      sendAsEmail: this.sendAsEmail,
    });

    $.export("$summary", "Successfully retrieved send as alias");

    return data;
  },
};
