import ispringLearn from "../../ispring_learn.app.mjs";

export default {
  props: {
    ispringLearn,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhookName: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook to identify on the iSpring Learn platform.",
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("webhookId", hookId);
    },
    _getHookId() {
      return this.db.get("webhookId");
    },
    getDocs() {
      return this.documentId;
    },
    generateMeta(body) {
      const ts = Date.now();
      return {
        id: `${ts}`,
        summary: this.getSummary(body),
        ts: ts,
      };
    },
  },
  hooks: {
    async activate() {
      await this.ispringLearn.registerSubscriber({
        data: {
          "subscriberName": this.webhookName,
          "callbackUrl": this.http.endpoint,
        },
      });
      await this.ispringLearn.sendConfimationCode({
        data: {
          "subscriberName": this.webhookName,
        },
      });
    },
    async deactivate() {
      await this.ispringLearn.deleteSubscriber({
        data: {
          "subscriberName": this.webhookName,
        },
      });
    },
  },
  async run({ body }) {
    if (body.type === "CONFIRMATION") {
      await this.ispringLearn.confirmCode({
        data: {
          subscriberName: this.webhookName,
          ...JSON.parse(body.payloads[0]),
        },
      });
      await this.ispringLearn.subscribe({
        data: {
          subscriberName: this.webhookName,
          subscription: {
            subscriptionType: this.getSubscriptionType(),
          },
        },
      });
      return true;
    }

    this.http.respond({
      status: 200,
      body: "Success",
    });

    this.$emit(body, this.generateMeta(body));
  },
};
