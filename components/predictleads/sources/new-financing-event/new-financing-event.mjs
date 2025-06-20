import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "predictleads-new-financing-event",
  name: "New Financing Event Added",
  description: "Emit new event for each new financing event. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/financing_events_dataset/retrieve_company_s_financing_events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    domain: {
      description: "The domain of the company to retrieve financing events for (e.g., `google.com`).",
      propDefinition: [
        common.props.app,
        "domain",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "found_at";
    },
    getResourcesFn() {
      return this.app.retrieveFinancingEvents;
    },
    getResourcesFnArgs() {
      return {
        domain: this.domain,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Financing Event ${resource.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
