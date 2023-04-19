import app from "../../danny_test_app.app.mjs";

export default {
  name: "hello world",
  version: "0.0.1",
  key: "danny_test_app-hello-world",
  description: "hello world test",
  type: "action",
  props: {
    app,
    hello: {
      type: "string",
      label: "Hello",
      description: "Hello world",
    },
  },
  async run() {
    return this;
  },
};
