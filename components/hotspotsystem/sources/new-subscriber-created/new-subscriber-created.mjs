import app from "../../hotspotsystem.app.mjs";

export default {
  key: "hotspotsystem-new-subscriber-created",
  name: "New Subscriber Created",
  description: "Emit new event when a new subscriber in a location is created. [See the docs](http://www.hotspotsystem.com/apidocs/api/reference/#operation-getsubscribersbylocationid).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
