import app from "../../nango.app.mjs";

export default {
  key: "nango-get-records",
  name: "Get Records",
  description: "Returns data synced with Nango Sync. [See the Documentation](https://docs.nango.dev/api-reference/sync/records-get)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
