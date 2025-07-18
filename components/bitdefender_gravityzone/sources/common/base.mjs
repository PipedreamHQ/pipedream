import bitdefender from "../../bitdefender_gravityzone.app.mjs";

export default {
  props: {
    bitdefender,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      await this.bitdefender.setPushEventSettings({
        data: {
          params: {
            status: 1, // enable push events
            ...this.getWebhookParams(),
          },
        },
      });
    },
    async deactivate() {
      await this.bitdefender.setPushEventSettings({
        data: {
          params: {
            status: 0, // disable push events
            ...this.getWebhookParams(),
          },
        },
      });
    },
  },
  methods: {
    getWebhookParams() {
      return {
        serviceType: "jsonRPC",
        serviceSettings: {
          url: this.http.endpoint,
          authorization: `Bearer ${this.bitdefender.$auth.api_key}`,
          requireValidSslCertificate: true,
        },
        subscribeToEventTypes: this.getEventTypes(),
      };
    },
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    if (!body) {
      return;
    }

    const events = body?.params?.events || [];
    for (const event of events) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    }
  },
};
