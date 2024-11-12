import sdk from "../../sdk.app.mjs";

export default {
  name: "New Event Received from the Next.js Pipedream SDK",
  version: "0.0.1",
  key: "sdk-nextjs-event-received",
  description: "Emit new event via the Next.js Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
