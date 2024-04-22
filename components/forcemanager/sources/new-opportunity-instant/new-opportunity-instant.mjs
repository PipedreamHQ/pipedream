import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-new-opportunity-instant",
  name: "New Opportunity Instant",
  description: "Emits a new event when a new opportunity is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    forcemanager,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    name: {
      propDefinition: [
        forcemanager,
        "name",
      ],
    },
    account: {
      propDefinition: [
        forcemanager,
        "account",
      ],
    },
    estimatedCloseDate: {
      propDefinition: [
        forcemanager,
        "estimatedCloseDate",
      ],
    },
    stage: {
      propDefinition: [
        forcemanager,
        "stage",
      ],
    },
    probability: {
      propDefinition: [
        forcemanager,
        "probability",
      ],
    },
    revenue: {
      propDefinition: [
        forcemanager,
        "revenue",
      ],
    },
  },
  methods: {
    _getOpportunityId() {
      return this.db.get("opportunityId") || null;
    },
    _setOpportunityId(id) {
      this.db.set("opportunityId", id);
    },
  },
  hooks: {
    async deploy() {
      const { data } = await this.forcemanager.createOpportunity(
        {
          name: this.name,
          account: this.account,
          estimatedCloseDate: this.estimatedCloseDate,
        },
        {
          stage: this.stage,
          probability: this.probability,
          revenue: this.revenue,
        },
      );

      this._setOpportunityId(data.id);
      this.$emit(data, {
        id: data.id,
        summary: `New Opportunity: ${data.name}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const { data } = await this.forcemanager.createOpportunity(
      {
        name: this.name,
        account: this.account,
        estimatedCloseDate: this.estimatedCloseDate,
      },
      {
        stage: this.stage,
        probability: this.probability,
        revenue: this.revenue,
      },
    );

    const lastOpportunityId = this._getOpportunityId();
    if (data.id !== lastOpportunityId) {
      this._setOpportunityId(data.id);
      this.$emit(data, {
        id: data.id,
        summary: `New Opportunity: ${data.name}`,
        ts: Date.now(),
      });
    }
  },
};
