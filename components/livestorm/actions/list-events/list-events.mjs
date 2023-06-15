import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-list-events",
  name: "List Events",
  description: "List the events of your workspace. [See the Documentation](https://developers.livestorm.co/reference/get_events)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
