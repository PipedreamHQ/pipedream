import postmark from "../../postmark.app.mjs";

export default {
  key: "new-inbound-email-received",
  name: "New inbound email received",
  description:
    "Emit new event when an email is received by the Postmark server",
  version: "0.0.1",
  type: "source",
  props: {
    postmark,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      return this.postmark.setInboundWebhookUrl(this.http.endpoint);
    },
    async deactivate() {
      return "";
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    this.$emit(event);
  },
};
