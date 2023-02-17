import app from "../../braze.app.mjs";

export default {
  key: "braze-new-user-event",
  name: "New User Event",
  description: "Emit new event when a new user event is created. [See the docs](https://www.braze.com/docs/api/endpoints/user_data/post_user_track#user-track).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
