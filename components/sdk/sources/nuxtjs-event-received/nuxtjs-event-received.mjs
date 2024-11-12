import sdk from "../../sdk.app.mjs";

export default {
  name: "New Event Received from the Nuxt.js Pipedream SDK",
  version: "0.0.1",
  key: "sdk-nuxtjs-event-received",
  description: "Emit new event via the Nuxt.js Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
