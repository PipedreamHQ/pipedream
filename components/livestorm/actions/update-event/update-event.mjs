import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-update-event",
  name: "Update Event",
  description: "Update an event with its full list of attributes. [See the Documentation](https://developers.livestorm.co/reference/put_events-id)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
