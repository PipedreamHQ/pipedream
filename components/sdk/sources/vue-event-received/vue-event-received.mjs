/* eslint-disable pipedream/source-description */
/* eslint-disable pipedream/source-name */
import sdk from "../../sdk.app.mjs";

export default {
  name: "Vue",
  version: "0.0.2",
  key: "sdk-vue-event-received",
  description: "Emit a new event via the Vue Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
