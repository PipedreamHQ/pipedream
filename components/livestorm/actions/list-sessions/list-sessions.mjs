import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-list-sessions",
  name: "List Sessions",
  description: "List all your event sessions. [See the Documentation](https://developers.livestorm.co/reference/get_sessions)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
