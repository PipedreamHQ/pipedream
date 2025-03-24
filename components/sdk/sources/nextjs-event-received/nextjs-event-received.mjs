/* eslint-disable pipedream/source-description */
/* eslint-disable pipedream/source-name */
import sdk from "../../sdk.app.mjs";

export default {
  name: "Next.js",
  version: "0.0.2",
  key: "sdk-nextjs-event-received",
  description: "Emit a new event via the Next.js Pipedream SDK.",
  props: {
    sdk,
  },
  type: "source",
  methods: {},
  async run() {},
};
