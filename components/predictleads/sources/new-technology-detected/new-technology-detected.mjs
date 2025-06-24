import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "predictleads-new-technology-detected",
  name: "New Technology Detected",
  description: "Emit new event for each new technology detected for a specific company. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/technology_detections_dataset/retrieve_technologies_used_by_specific_company)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    domain: {
      description: "The domain of the company to retrieve technology detections for (e.g., `google.com`).",
      propDefinition: [
        common.props.app,
        "domain",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "first_seen_at";
    },
    getResourcesFn() {
      return this.app.retrieveTechnologyDetections;
    },
    getResourcesFnArgs() {
      return {
        domain: this.domain,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Technology Detected: ${resource.id}`,
        ts: Date.parse(resource.attributes.first_seen_at),
      };
    },
  },
  sampleEmit,
};
