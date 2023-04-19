import app from "../../shotstack.app.mjs";

export default {
  key: "shotstack-start-render",
  name: "Start Render",
  description: "Initiate rendering of a video using a timeline created in Shotstack API. [See the documentation here](https://shotstack.io/docs/api/?shell#render-asset).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
