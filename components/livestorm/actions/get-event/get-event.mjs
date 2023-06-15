import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-get-event",
  name: "Get Event",
  description: "Retrieve a single event. [See the Documentation](https://developers.livestorm.co/reference/get_events-id)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
