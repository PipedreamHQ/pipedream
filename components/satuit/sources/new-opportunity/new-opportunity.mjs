import satuit from "../../satuit.app.mjs";
import {
  axios, defineSource,
} from "@pipedream/platform";

export default defineSource({
  key: "satuit-new-opportunity",
  name: "New Opportunity",
  description: "Emits an event when a new opportunity is created in Satuit.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    satuit,
    db: "$.service.db",
    opportunityTitle: {
      propDefinition: [
        satuit,
        "opportunityTitle",
      ],
    },
    opportunityDescription: {
      propDefinition: [
        satuit,
        "opportunityDescription",
      ],
    },
    opportunityValue: {
      propDefinition: [
        satuit,
        "opportunityValue",
      ],
    },
    associatedBusinesses: {
      propDefinition: [
        satuit,
        "associatedBusinesses",
        (c) => ({
          optional: true,
        }),
      ],
    },
    associatedContacts: {
      propDefinition: [
        satuit,
        "associatedContacts",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetches up to the last 50 opportunities and emits them
      const opportunities = await this.satuit.getOpportunities({
        title: this.opportunityTitle,
        description: this.opportunityDescription,
        value: this.opportunityValue,
        businesses: this.associatedBusinesses,
        contacts: this.associatedContacts,
      });

      opportunities.slice(0, 50).forEach((opportunity) => {
        this.$emit(opportunity, {
          id: opportunity.id,
          summary: `New Opportunity: ${opportunity.title}`,
          ts: Date.parse(opportunity.created_at),
        });
      });
    },
  },
  async run() {
    // Poll for new opportunities since the last run
    const lastOpportunityId = this.db.get("lastOpportunityId") || 0;
    const opportunities = await this.satuit.getOpportunities({
      title: this.opportunityTitle,
      description: this.opportunityDescription,
      value: this.opportunityValue,
      businesses: this.associatedBusinesses,
      contacts: this.associatedContacts,
      sinceId: lastOpportunityId,
    });

    opportunities.forEach((opportunity) => {
      this.$emit(opportunity, {
        id: opportunity.id,
        summary: `New Opportunity: ${opportunity.title}`,
        ts: Date.parse(opportunity.created_at),
      });
    });

    if (opportunities.length > 0) {
      const latestOpportunityId = opportunities[0].id;
      this.db.set("lastOpportunityId", latestOpportunityId);
    }
  },
});
