import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "launchdarkly-new-access-token-event",
  name: "New Access Token Event",
  description: "Emit new event when a new access token activity happens. [See the documentation](https://apidocs.launchdarkly.com/tag/Webhooks#operation/postWebhook).",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    memberId: {
      propDefinition: [
        common.props.app,
        "memberId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getStatements() {
      return [
        {
          resources: [
            `member/${this.memberId}:token/*`,
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
        date: ts,
      } = resource;
      return {
        id,
        summary: `New Access Token Event ${id}`,
        ts,
      };
    },
  },
};
