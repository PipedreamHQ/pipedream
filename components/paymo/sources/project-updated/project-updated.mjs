import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "paymo-project-updated",
  name: "Project Updated",
  description: "Emit new event when a project is updated. [See the docs](https://github.com/paymoapp/api/blob/master/sections/webhooks.md#events).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
  },
};
