import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sellsy-updated-opportunity-status-instant",
  name: "Updated Opportunity Status (Instant)",
  description: "Emit new event when the status is changed on an opportunity in Sellsy",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    opportunityIds: {
      propDefinition: [
        common.props.sellsy,
        "opportunityIds",
      ],
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter results by the new opportunity status",
      options: constants.OPPORTUNITY_STATUS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return "opportunity.status";
    },
    getResultItem({ relatedid }) {
      return this.sellsy.getOpportunity({
        opportunityId: relatedid,
      });
    },
    isRelevant(opportunity) {
      return ((!this.statuses?.length || (this.statuses.includes(opportunity.status)))
        && (!this.opportunityIds?.length || (this.opportunityIds.includes(opportunity.id))));
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.updated_status);
      return {
        id: `${opportunity.id}-${ts}`,
        summary: `Opportunity updated with ID: ${opportunity.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
