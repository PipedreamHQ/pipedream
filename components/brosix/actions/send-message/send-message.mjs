import app from "../../brosix.app.mjs";

export default {
  key: "brosix-send-message",
  name: "Send Message",
  description: "Send a message with Brosix. [See the documentation](https://help.brosix.com/notifications-api/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    msg: {
      propDefinition: [
        app,
        "msg",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendMessage({
      $,
      params: {
        msg: this.msg,
      },
    });
    $.export("$summary", "Successfully sent the message");
    return response;
  },
};
