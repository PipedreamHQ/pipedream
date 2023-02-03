import app from "../../braze.app.mjs";

export default {
  key: "braze-track-event",
  name: "Track An Event",
  description: "Tracks an event. [See the docs](https://www.braze.com/docs/api/endpoints/user_data/post_user_track#user-track).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
