export default {
  key: "postmark-new-inbound-email-received",
  name: "New Inbound Email Received",
  description: "Emit new event when an email is received by the Postmark server [(See docs here)](https://postmarkapp.com/developer/webhooks/inbound-webhook)",
  version: "0.0.1",
  type: "source",
  props: {
    postmark: {
      type: "app",
      app: "postmark",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      return this.postmark.setServerInfo({
        [this.getWebhookType()]: this.http.endpoint,
        ...this.getWebhookProps(),
      });
    },
    async deactivate() {
      return this.postmark.setServerInfo({
        [this.getWebhookType()]: "",
      });
    },
  },
  methods: {
    getWebhookType() {
      return "InboundHookUrl";
    },
  },
  async run(data) {
    this.http.respond({
      status: 200,
    });

    let dateParam = data.ReceivedAt ?? data.Date ?? Date.now();
    let dateObj = new Date(dateParam);

    let msgId = data.MessageID;
    let id = `${msgId}-${dateObj.toISOString()}`;

    this.$emit(data, {
      id,
      summary: data.Subject,
      ts: dateObj.valueOf(),
    });
  },
};
