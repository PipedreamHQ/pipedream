import gosquared from "../../gosquared.app.mjs";

export default {
  props: {
    gosquared,
    db: "$.service.db",
    http: "$.interface.http",
    siteToken: {
      propDefinition: [
        gosquared,
        "siteToken",
      ],
    },
    includeUnverified: {
      type: "boolean",
      label: "Include Unverified",
      description: `An unverified lead is somebody that has not confirmed their email address.
      \nWhen Assistant captures a new lead, their email address will be unverified until your web-app identifies them (usually when they sign-up/log-in).`,
      default: true,
    },
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
  },
  hooks: {
    async activate() {
      const response = await this.gosquared.createHook({
        data: {
          url: this.http.endpoint,
          trigger: this.getTrigger(),
          include_unverified: this.includeUnverified,
        },
        params: {
          site_token: this.siteToken,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.gosquared.deleteHook({
        webhookId,
        params: {
          site_token: this.siteToken,
        },
      });
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
