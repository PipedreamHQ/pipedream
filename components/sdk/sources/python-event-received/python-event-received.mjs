import sdk from "../../sdk.app.mjs";

export default {
  name: "New Event Received from the Python Pipedream SDK",
  version: "0.0.1",
  key: "sdk-python-event-received",
  description: "Emit new event via the Python Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
