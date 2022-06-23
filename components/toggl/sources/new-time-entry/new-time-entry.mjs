import base from "../common/base.mjs";

export default {
  ...base,
  name: "New Time Entry (Instant)",
  version: "0.0.1",
  key: "toggl-new-time-entry",
  description: "Emit new event when a time entry is created. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/webhooks.md)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    _getAction() {
      return "created";
    },
    _getEntity() {
      return "time_entry";
    },
  },
};
