import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "recruit_crm-candidate-created",
  name: "Candidate Created (Instant)",
  description: "Triggers when a new candidate is created. [See the documentation](https://docs.recruitcrm.io/docs/rcrm-api-reference/5e7ebc825ccf9-creates-a-new-subscription)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listCandidates;
    },
    getResourcesFnArgs() {
      return {
        params: {
          limit: constants.PAGINATION.LIMIT,
          sort_by: constants.PAGINATION.SORT_BY.CREATED_ON,
          sort_order: constants.PAGINATION.SORT_ORDER.DESC,
        },
      };
    },
    getEventName() {
      return events.CANDIDATE_CREATED;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Candidate: ${resource.first_name}`,
        ts: Date.parse(resource.created_on),
      };
    },
  },
};
