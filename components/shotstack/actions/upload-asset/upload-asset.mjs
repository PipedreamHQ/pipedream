import app from "../../shotstack.app.mjs";

export default {
  key: "shotstack-upload-asset",
  name: "Upload Asset",
  description: "Add media assets like images, audio, or video to the Shotstack API for use in video projects. [See the documentation here](https://shotstack.io/docs/api/?shell#direct-upload).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
