import sellsy from "../../sellsy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sellsy-updated-opportunity-status-instant",
  name: "Updated Opportunity Status Instant",
  description: "Emits an event when the status is changed on an opportunity in Sellsy",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sellsy,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    opportunityName: {
      propDefinition: [
        sellsy,
        "opportunityName",
      ],
    },
    opportunityStatus: {
      propDefinition: [
        sellsy,
        "opportunityStatus",
      ],
      optional: true,
    },
    opportunityDetails: {
      propDefinition: [
        sellsy,
        "opportunityDetails",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.sellsy.createWebhook({
        url: this.http.endpoint,
        events: [
          "opportunity_status_changed",
        ],
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.sellsy.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    const isValid = this.sellsy.isValidSignature(
      body,
      headers["Sellsy-Signature"],
      this.sellsy.$auth.oauth_access_token,
    );

    if (!isValid) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const { opportunity } = body;
    if (opportunity.name !== this.opportunityName) {
      return;
    }

    this.$emit(opportunity, {
      id: opportunity.id,
      summary: `Opportunity ${opportunity.name} status updated`,
      ts: Date.now(),
    });
  },
};
