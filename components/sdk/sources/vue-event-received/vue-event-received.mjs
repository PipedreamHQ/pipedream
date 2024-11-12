import sdk from "../../sdk.app.mjs";

export default {
  name: "New Event Received from the Vue Pipedream SDK",
  version: "0.0.1",
  key: "sdk-vue-event-received",
  description: "Emit new event via the Vue Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
