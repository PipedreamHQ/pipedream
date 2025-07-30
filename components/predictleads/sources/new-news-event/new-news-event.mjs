import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "predictleads-new-news-event",
  name: "New News Event Added",
  description: "Emit new event for each new news event for a specific company. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/news_events_dataset/retrieve_company_s_news_events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    domain: {
      description: "The domain of the company to retrieve news events for (e.g., `google.com`).",
      propDefinition: [
        common.props.app,
        "domain",
      ],
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "Filter news events by specific categories.",
      optional: true,
      options: [
        "acquires",
        "merges_with",
        "sells_assets_to",
        "signs_new_client",
        "files_suit_against",
        "has_issues_with",
        "closes_offices_in",
        "decreases_headcount_by",
        "attends_event",
        "expands_facilities",
        "expands_offices_in",
        "expands_offices_to",
        "increases_headcount_by",
        "opens_new_location",
        "goes_public",
        "invests_into",
        "invests_into_assets",
        "receives_financing",
        "hires",
        "leaves",
        "promotes",
        "retires_from",
        "integrates_with",
        "is_developing",
        "launches",
        "partners_with",
        "receives_award",
        "recognized_as",
        "identified_as_competitor_of",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "found_at";
    },
    getResourcesFn() {
      return this.app.retrieveNewsEvents;
    },
    getResourcesFnArgs() {
      const {
        domain, categories,
      } = this;
      return {
        domain,
        params: {
          categories: categories?.join(","),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New News Event: ${resource.id}`,
        ts: Date.parse(resource.attributes.found_at),
      };
    },
  },
  sampleEmit,
};
