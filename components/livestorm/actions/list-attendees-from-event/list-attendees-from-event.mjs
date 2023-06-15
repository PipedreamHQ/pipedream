import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-list-attendees-from-event",
  name: "List Attendees From Event",
  description: "List all the people linked to all the sessions of an event. [See the Documentation](https://developers.livestorm.co/reference/get_events-id-people)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
