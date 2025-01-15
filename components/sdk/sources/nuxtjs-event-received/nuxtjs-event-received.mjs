/* eslint-disable pipedream/source-description */
/* eslint-disable pipedream/source-name */
import sdk from "../../sdk.app.mjs";

export default {
  name: "NuxtJS",
  version: "0.0.2",
  key: "sdk-nuxtjs-event-received",
  description: "Emit a new event via the Nuxt.js Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
