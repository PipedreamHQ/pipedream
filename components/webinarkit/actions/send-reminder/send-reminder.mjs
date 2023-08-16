import app from "../../webinarkit.app.mjs";

export default {
  key: "webinarkit-send-reminder",
  name: "Send Reminder",
  description: "Sends a reminder to the attendees about the pending webinar. [See the documentation](https://documenter.getpostman.com/view/22597176/Uzs435mo#033f7d11-dcd3-4130-b41b-7eee4d4f28d1)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
