import app from "../../braze.app.mjs";

export default {
  key: "braze-send-message",
  name: "Send A Message",
  description: "Sends a message to a user. [See the docs](https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_send_messages/).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
