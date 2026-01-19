import pitchlane from "../../pitchlane.app.mjs";
const { ConfigurationError } = "@pipedream/platform";

export default {
  props: {
    pitchlane,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    campaignId: {
      propDefinition: [
        pitchlane,
        "campaignId",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      await this.pitchlane.createWebhook({
        data: {
          webhookUrl: this.http.endpoint,
          campaignId: this.campaignId,
          trigger: this.getEventType(),
        },
      });
    },
    async deactivate() {
      await this.pitchlane.deleteWebhook({
        params: {
          webhookUrl: this.http.endpoint,
          campaignId: this.campaignId,
          trigger: this.getEventType(),
        },
      });
    },
  },
  methods: {
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    this.$emit(body, this.generateMeta(body));
  },
};
