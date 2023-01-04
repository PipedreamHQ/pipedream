import app from "../../plivo.app.mjs";

export default {
  key: "plivo-new-completed-call",
  name: "New Completed Call",
  description: "Emit new event when a call is completed. [See the docs](https://www.plivo.com/docs/voice/api/call#retrieve-all-calls).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
