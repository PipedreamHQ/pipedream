import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-new-lead-instant",
  name: "New Lead Instant",
  description: "Emit new event when a new lead is created via a lead capture form. [See the documentation](https://apidocs.flippingbook.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    flippingbook: {
      type: "app",
      app: "flippingbook",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        flippingbook,
        "formId",
      ],
    },
    leadDetails: {
      propDefinition: [
        flippingbook,
        "leadDetails",
        (c) => ({
          formId: c.formId,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.flippingbook.createTrackedLink({
        formId: this.formId,
      });
      this.db.set("triggerId", id);
    },
    async deactivate() {
      const id = this.db.get("triggerId");
      if (id) {
        await this.flippingbook.deleteTrigger(id);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // validate the incoming webhook via its headers (e.g. signature)
    if (!this.flippingbook.verifyWebhook(headers, this.db.get("triggerId"))) {
      return this.http.respond({
        status: 403,
      });
    }

    this.http.respond({
      status: 200,
    });

    // emit the event
    this.$emit(body, {
      id: headers["x-pipedream-request-id"],
      summary: `New lead in form ${this.formId}`,
      ts: +new Date(headers["date"]),
    });
  },
};
