import postmark from "../postmark.app.mjs";

export default {
  props: {
    postmark,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getWebhookType() {
      throw new Error("Component is missing Webhook type definition");
    },
    getWebhookProps() {
      return {};
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
