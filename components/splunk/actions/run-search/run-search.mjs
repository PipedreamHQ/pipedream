import splunk from "../../splunk.app.mjs";

export default {
  key: "splunk-run-search",
  name: "Run Search",
  description: "Executes a Splunk search query and returns the results. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#search.2Fjobs)",
  version: "0.0.1",
  type: "action",
  props: {
    splunk,
    query: {
      propDefinition: [
        splunk,
        "query",
      ],
    },
    earliestTime: {
      type: "string",
      label: "Earliest Time",
      description: "Specify a time string. Sets the earliest (inclusive), respectively, time bounds for the search. The time string can be either a UTC time (with fractional seconds), a relative time specifier (to now) or a formatted time string. Refer to [Time modifiers](https://docs.splunk.com/Documentation/Splunk/9.4.1/SearchReference/SearchTimeModifiers) for search for information and examples of specifying a time string.",
      optional: true,
    },
    latestTime: {
      type: "string",
      label: "Latest Time",
      description: "  Specify a time string. Sets the latest (exclusive), respectively, time bounds for the search. The time string can be either a UTC time (with fractional seconds), a relative time specifier (to now) or a formatted time string. Refer to [Time modifiers](https://docs.splunk.com/Documentation/Splunk/9.4.1/SearchReference/SearchTimeModifiers) for search for information and examples of specifying a time string.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.splunk.executeSearchQuery({
      $,
      data: {
        search: this.query,
        earliest_time: this.earliestTime,
        latest_time: this.latestTime,
      },
    });
    $.export("$summary", `Executed Splunk search query: ${this.query}`);
    return response;
  },
};
