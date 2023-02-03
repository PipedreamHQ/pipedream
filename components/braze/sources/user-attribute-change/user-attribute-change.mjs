import app from "../../braze.app.mjs";

export default {
  key: "braze-user-attribute-change",
  name: "New User Attribute Change",
  description: "Emit new event when a user attribute is changed. [See the docs](https://www.braze.com/docs/api/endpoints/user_data/post_user_track#user-track).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
