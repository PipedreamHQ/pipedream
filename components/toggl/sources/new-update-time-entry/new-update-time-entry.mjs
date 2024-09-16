import base from "../common/base.mjs";

export default {
  ...base,
  name: "New Update Time Entry (Instant)",
  version: "0.0.4",
  key: "toggl-new-update-time-entry",
  description: "Emit new event when a time entry is updated. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/webhooks.md)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    _getAction() {
      return "updated";
    },
    _getEntity() {
      return "time_entry";
    },
  },
};
