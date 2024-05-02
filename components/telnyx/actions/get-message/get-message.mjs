import telnyxApp from "../../telnyx.app.mjs";

export default {
  key: "telnyx-get-message",
  name: "Retrieve a Message",
  description: "Retrieve a message. See documentation [here](https://developers.telnyx.com/api/messaging/get-message)",
  version: "0.0.1",
  type: "action",
  props: {
    telnyxApp,
    id: {
      type: "string",
      label: "Message Id",
      description: "The id of the message.",
    },
  },
  async run({ $ }) {
    const message = await this.telnyxApp.getMessage({
      $,
      id: this.id,
    });
    $.export("$summary", `Successfully retrieved message ${message.data.id}.`);
    return message;
  },
};
