import common from "../common.mjs";

export default {
  ...common,
  key: "postmark-new-inbound-email-received",
  name: "New Inbound Email Received",
  description: "Emit new event when an email is received by the Postmark server. This source updates the server's inbound URL. You cannot create multiple inbound sources for the same server. [See the documentation](https://postmarkapp.com/developer/webhooks/inbound-webhook#set-the-webhook-url)",
  version: "1.0.0",
  type: "source",
  props: {
    ...common.props,
    serverId: {
      propDefinition: [
        common.props.postmark,
        "serverId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookProps() {
      return {
        MessageStream: "inbound",
      };
    },
    getSummary(body) {
      return `New email received! MessageID - ${body.MessageID}`;
    },
  },
  hooks: {
    async activate() {
      await this.postmark.setServerInfo({
        serverId: this.serverId,
        data: {
          InboundHookUrl: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      return true;
    },
  },
};
