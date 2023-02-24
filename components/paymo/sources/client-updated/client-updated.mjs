import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "paymo-client-updated",
  name: "Client Updated",
  description: "Emit new event when a client is updated. [See the docs](https://github.com/paymoapp/api/blob/master/sections/webhooks.md#events).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
  },
};
