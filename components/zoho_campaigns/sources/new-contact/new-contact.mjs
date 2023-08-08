import app from "../../zoho_campaigns.app.mjs";

export default {
  dedupe: "unique",
  type: "source",
  key: "zoho_campaign-new-contact",
  name: "New Contact",
  description: "Emit new event when a new user is created.",
  version: "0.0.2",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  async run(event) {
    console.log("running");
    console.log(event);
  },
};
