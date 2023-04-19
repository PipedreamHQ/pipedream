import app from "../../app/danny_test_app.app.mjs";

export default {
  name: "hello world",
  version: "0.0.2",
  key: "danny_test_app-hello-world",
  description: "Hello World test",
  type: "action",
  props: {
    app,
    hello: {
      type: "string",
      label: "Hello",
      description: "Hello World",
    },
  },
  async run() {
    return this;
  },
};

