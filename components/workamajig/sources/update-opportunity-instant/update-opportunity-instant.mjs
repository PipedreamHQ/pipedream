import Workamajig from "../../workamajig.app.mjs";

export default {
  key: "workamajig-update-opportunity-instant",
  name: "Update Opportunity Instant",
  description: "Emit new event when an opportunity is updated. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    workamajig: {
      type: "app",
      app: "workamajig",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    opportunityId: {
      propDefinition: [
        Workamajig,
        "opportunityId",
      ],
    },
  },
  methods: {
    async getOpportunityDetails() {
      return this.workamajig._makeRequest({
        path: `/opportunity/${this.opportunityId}`,
      });
    },
  },
  hooks: {
    async deploy() {
      const opportunity = await this.getOpportunityDetails();
      this.$emit(opportunity, {
        id: opportunity.id,
        summary: `Opportunity: ${opportunity.name}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.timestamp;
    const opportunity = await this.getOpportunityDetails();

    if (new Date(opportunity.lastModified).getTime() > new Date(lastRunTime).getTime()) {
      this.$emit(opportunity, {
        id: opportunity.id,
        summary: `Opportunity: ${opportunity.name}`,
        ts: Date.now(),
      });
    }

    this.db.set("lastRunTime", this.timer.timestamp);
  },
};
