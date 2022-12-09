import app from "../../ortto.app.mjs";

export default {
  key: "ortto-new-activity-(instant)",
  name: "New Activity (Instant)",
  description: "Emit new event a new activity is triggered. [See the docs](https://help.ortto.com/user/latest/data-sources/configuring-a-new-data-source/other-integrations/webhook.html#create-your-webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
