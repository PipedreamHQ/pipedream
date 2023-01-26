import app from "../../hotspotsystem.app.mjs";

export default {
  key: "hotspotsystem-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer in a location is created. [See the docs](http://www.hotspotsystem.com/apidocs/api/reference/#operation-getcustomersbylocationid).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
