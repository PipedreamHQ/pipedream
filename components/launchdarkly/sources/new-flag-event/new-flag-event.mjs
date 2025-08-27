import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "launchdarkly-new-flag-event",
  name: "New Flag Event",
  description: "Emit new event when flag activity occurs. [See the documentation](https://apidocs.launchdarkly.com/tag/Webhooks#operation/postWebhook).",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getStatements() {
      return [
        {
          resources: [
            "proj/*:env/*:flag/*",
          ],
          actions: [
            "*",
          ],
          effect: "allow",
        },
      ];
    },
    generateMeta(resource) {
      const {
        _id: id,
        name,
        date: ts,
      } = resource;
      return {
        id,
        summary: `New Flag ${name}`,
        ts,
      };
    },
  },
};
