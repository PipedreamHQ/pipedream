import common from "../common/base.mjs";

export default {
  ...common,
  key: "tokportal-account-banned",
  name: "New Account Banned (Instant)",
  description: "Emit new event when one of your managed accounts is banned by the platform (`account.banned`):"
    + " the manager reported a ban with no appeal available, or the platform refused the appeal."
    + " Use **List Account Bans** to follow the appeal and resolution lifecycle."
    + " [See the documentation](https://developers.tokportal.com/bans-and-appeals/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "account.banned",
      ];
    },
    getDescription() {
      return "Pipedream source: New Account Banned";
    },
    getSummary(body) {
      const data = body?.data ?? {};
      return `Account banned: @${data.username ?? "unknown"} (${data.platform ?? "unknown platform"})`;
    },
    getTimestamp(body) {
      const ts = Date.parse(body?.data?.banned_at ?? body?.created_at);
      return Number.isFinite(ts)
        ? ts
        : Date.now();
    },
  },
};
