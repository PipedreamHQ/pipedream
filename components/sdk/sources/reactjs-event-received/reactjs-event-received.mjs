import sdk from "../../sdk.app.mjs";

export default {
  name: "New Event Received from the React.js Pipedream SDK",
  version: "0.0.1",
  key: "sdk-reactjs-event-received",
  description: "Emit new event via the React.js Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
