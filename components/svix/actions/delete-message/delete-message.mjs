import svix from "../../svix.app.mjs";

export default {
  key: "svix-delete-message",
  name: "Delete Message",
  description: "Delete the given message's payload. [See the docs here](https://api.svix.com/docs#tag/Message/operation/expunge_message_payload_api_v1_app__app_id__msg__msg_id__content__delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    svix,
    appId: {
      propDefinition: [
        svix,
        "appId",
      ],
    },
    messageId: {
      propDefinition: [
        svix,
        "messageId",
        (c) => ({
          appId: c.appId,
        }),
      ],
    },
  },
  async run({ $ }) {
    await this.svix.deleteMessage(this.appId, this.messageId, {
      $,
    });
    $.export("$summary", `Successfully deleted message with ID ${this.messageId}`);
    // nothing to return
  },
};
