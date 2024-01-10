import oyster from "../../oyster.app.mjs";

export default {
  key: "oyster-new-engagement",
  name: "New Engagement",
  description: "Emits a new event when a new engagement is added.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    oyster,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    employeeName: {
      propDefinition: [
        oyster,
        "employeeName",
      ],
    },
    engagementDetails: {
      propDefinition: [
        oyster,
        "engagementDetails",
      ],
    },
    engagementStart: {
      propDefinition: [
        oyster,
        "engagementStart",
      ],
      optional: true,
    },
    engagementEnd: {
      propDefinition: [
        oyster,
        "engagementEnd",
      ],
      optional: true,
    },
  },
  methods: {
    _getNewEngagements() {
      return this.oyster.postNewEngagement({
        employeeName: this.employeeName,
        engagementDetails: this.engagementDetails,
        engagementStart: this.engagementStart,
        engagementEnd: this.engagementEnd,
      });
    },
  },
  hooks: {
    async deploy() {
      const { data: newEngagement } = await this._getNewEngagements();
      this.$emit(newEngagement, {
        id: newEngagement.id,
        summary: `New Engagement: ${newEngagement.name}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const { data: newEngagement } = await this._getNewEngagements();
    this.$emit(newEngagement, {
      id: newEngagement.id,
      summary: `New Engagement: ${newEngagement.name}`,
      ts: Date.now(),
    });
  },
};
