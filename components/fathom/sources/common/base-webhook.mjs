import fathom from "../../fathom.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    fathom,
    db: "$.service.db",
    http: "$.interface.http",
    includeActionItems: {
      propDefinition: [
        fathom,
        "includeActionItems",
      ],
    },
    includeCrmMatches: {
      propDefinition: [
        fathom,
        "includeCrmMatches",
      ],
    },
    includeSummary: {
      propDefinition: [
        fathom,
        "includeSummary",
      ],
    },
    includeTranscript: {
      propDefinition: [
        fathom,
        "includeTranscript",
      ],
    },
  },
  hooks: {
    async activate() {
      if (
        !this.includeTranscript
        && !this.includeSummary
        && !this.includeCrmMatches
        && !this.includeActionItems)
      {
        throw new ConfigurationError("At least one of includeTranscript, includeSummary, includeCrmMatches, or includeActionItems must be true");
      }

      const { id } = await this.fathom.createWebhook({
        data: {
          destination_url: this.http.endpoint,
          ...this.getWebhookData(),
        },
      });

      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.fathom.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookData() {
      throw new ConfigurationError("getWebhookData is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;

    if (!body) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
