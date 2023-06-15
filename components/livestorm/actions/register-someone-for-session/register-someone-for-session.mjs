import app from "../../livestorm.app.mjs";

export default {
  key: "livestorm-register-someone-for-session",
  name: "Register Someone For A Session",
  description: "Register a new participant for a session (either an external registrant or internal team member). [See the Documentation](https://developers.livestorm.co/reference/post_sessions-id-people)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
