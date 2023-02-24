import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "paymo-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created. [See the docs](https://github.com/paymoapp/api/blob/master/sections/webhooks.md#events).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
  },
};
