import { axios } from "@pipedream/platform";
import bloomerang from "../../bloomerang.app.mjs";

export default {
  key: "bloomerang-new-interaction",
  name: "New Interaction",
  description: "Emit new event when a new interaction is logged for a constituent. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bloomerang,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // Every 15 minutes
      },
    },
    interactionType: {
      propDefinition: [
        bloomerang,
        "interactionType",
      ],
    },
    campaignId: {
      propDefinition: [
        bloomerang,
        "campaignId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const interactions = await this.getRecentInteractions();
      for (const interaction of interactions.slice(0, 50)) {
        this.$emit(interaction, {
          id: interaction.id,
          summary: `New Interaction: ${interaction.type}`,
          ts: Date.parse(interaction.date),
        });
      }
    },
  },
  methods: {
    _getLastCheck() {
      return this.db.get("lastCheck") || new Date(0).toISOString();
    },
    _setLastCheck(lastCheck) {
      this.db.set("lastCheck", lastCheck);
    },
    async getRecentInteractions() {
      const lastCheck = this._getLastCheck();
      const params = {
        filter: `createdDate>='${lastCheck}'`,
        ...(this.interactionType
          ? {
            interactionType: this.interactionType,
          }
          : {}),
        ...(this.campaignId
          ? {
            campaignId: this.campaignId,
          }
          : {}),
      };

      const interactions = await axios(this, {
        url: `${this.bloomerang._baseUrl()}/interactions`,
        headers: {
          Authorization: `Bearer ${this.bloomerang.$auth.api_key}`,
        },
        params,
      });

      const lastInteractionDate = interactions.length
        ? interactions[0].createdDate
        : new Date().toISOString();
      this._setLastCheck(lastInteractionDate);

      return interactions;
    },
  },
  async run() {
    const interactions = await this.getRecentInteractions();
    for (const interaction of interactions) {
      this.$emit(interaction, {
        id: interaction.id,
        summary: `New Interaction: ${interaction.type}`,
        ts: Date.parse(interaction.date),
      });
    }
  },
};
