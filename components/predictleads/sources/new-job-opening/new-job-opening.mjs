import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "predictleads-new-job-opening",
  name: "New Job Opening Added",
  description: "Emit new event for each new job opening for a specific company. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/job_openings_dataset/retrieve_job_openings_from_specific_company)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    domain: {
      description: "The domain of the company to retrieve job openings for (e.g., `google.com`).",
      propDefinition: [
        common.props.app,
        "domain",
      ],
    },
    activeOnly: {
      type: "boolean",
      label: "Active Only",
      description: "Set to `true` to receive Job Openings that are not closed",
      optional: true,
    },
    withDescriptionOnly: {
      type: "boolean",
      label: "With Description Only",
      description: "Set to `true` to only return Job Openings that have a description.",
      optional: true,
    },
    withLocationOnly: {
      type: "boolean",
      label: "With Location Only",
      description: "Set to `true` to only return Job Openings that have a location.",
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "Filter job openings by specific categories.",
      optional: true,
      options: [
        "administration",
        "consulting",
        "data_analysis",
        "design",
        "directors",
        "education",
        "engineering",
        "finance",
        "healthcare_services",
        "human_resources",
        "information_technology",
        "internship",
        "legal",
        "management",
        "marketing",
        "military_and_protective_services",
        "operations",
        "purchasing",
        "product_management",
        "quality_assurance",
        "real_estate",
        "research",
        "sales",
        "software_development",
        "support",
        "manual_work",
        "food",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "last_seen_at";
    },
    getResourcesFn() {
      return this.app.retrieveJobOpenings;
    },
    getResourcesFnArgs() {
      const {
        domain,
        activeOnly,
        withDescriptionOnly,
        withLocationOnly,
        categories,
      } = this;
      return {
        domain,
        params: {
          active_only: activeOnly,
          with_description_only: withDescriptionOnly,
          with_location_only: withLocationOnly,
          categories: categories?.join(","),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Job Opening: ${resource.attributes.title}`,
        ts: Date.parse(resource.attributes.first_seen_at),
      };
    },
  },
  sampleEmit,
};
