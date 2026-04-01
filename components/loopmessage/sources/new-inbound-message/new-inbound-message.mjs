import app from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-new-inbound-message",
  name: "Inbound message",
  description: "New inbound message",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.webhook_id || body.message_id,
      summary: body.contact
        ? `New inbound message from ${body.contact}`
        : "New inbound received",
      ts: body.created_at
        ? Date.parse(body.created_at)
        : Date.now(),
    });

    this.http.respond({
      status: 200,
    });
  },
};
