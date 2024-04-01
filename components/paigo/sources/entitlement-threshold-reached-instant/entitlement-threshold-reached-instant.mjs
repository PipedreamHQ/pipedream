import paigo from "../../paigo.app.mjs";

export default {
  key: "paigo-entitlement-threshold-reached-instant",
  name: "Entitlement Threshold Reached Instant",
  description: "Emit new event when customers' usage reaches a threshold of 80% or 100% of their offerings. [See the documentation](http://www.api.docs.paigo.tech/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    paigo: {
      type: "app",
      app: "paigo",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    customerId: {
      propDefinition: [
        paigo,
        "customerId",
      ],
    },
    offeringId: {
      propDefinition: [
        paigo,
        "offeringId",
      ],
    },
    usageAmount: {
      propDefinition: [
        paigo,
        "usageAmount",
      ],
    },
  },
  methods: {
    calculateUsagePercentage(offeringDetails, usageAmount) {
      const offeringAmount = offeringDetails.amount;
      return (usageAmount / offeringAmount) * 100;
    },
    generateMeta(id, summary, ts) {
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the incoming webhook request
    if (headers["Authorization"] !== `Bearer ${this.paigo.$auth.api_token}`) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const {
      customerId, offeringId, usageAmount,
    } = body;

    // Fetch the offering details
    const offeringDetails = await this.paigo._makeRequest({
      path: `/offerings/${offeringId}`,
    });

    // Calculate the usage percentage
    const usagePercentage = this.calculateUsagePercentage(offeringDetails, usageAmount);

    // Emit an event if the usage reaches a threshold of 80% or 100%
    if (usagePercentage >= 80) {
      this.$emit(body, {
        id: body.id,
        summary: `Usage for customer ${customerId} has reached ${usagePercentage}% of their offering`,
        ts: Date.parse(body.timestamp),
      });
    }
  },
};
