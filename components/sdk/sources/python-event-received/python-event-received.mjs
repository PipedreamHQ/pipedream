/* eslint-disable pipedream/source-description */
/* eslint-disable pipedream/source-name */
import sdk from "../../sdk.app.mjs";

export default {
  name: "Python",
  version: "0.0.2",
  key: "sdk-python-event-received",
  description: "Emit a new event via the Python Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
