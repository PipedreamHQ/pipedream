import common from "../common/base.mjs";

export default {
  ...common,
  key: "tokportal-account-delivered",
  name: "New Account Delivered (Instant)",
  description: "Emit new event when a managed account is finalized and delivered to your workspace (`account.finalized`)."
    + " The payload includes the `saved_account_id` you can pass to **Get Account** or **Create Bundle** (`videos_only`)."
    + " [See the documentation](https://developers.tokportal.com/webhooks/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "account.finalized",
      ];
    },
    getDescription() {
      return "Pipedream source: New Account Delivered";
    },
    getSummary(body) {
      const data = body?.data ?? {};
      return `Account delivered: @${data.username ?? "unknown"} (${data.platform ?? "unknown platform"})`;
    },
  },
};
