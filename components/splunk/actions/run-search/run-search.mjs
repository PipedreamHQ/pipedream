import splunk from "../../splunk.app.mjs";

export default {
  key: "splunk-run-search",
  name: "Run Search",
  description: "Executes a Splunk search query and returns the results. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#search.2Fjobs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    splunk,
    name: {
      propDefinition: [
        splunk,
        "savedSearchName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.splunk.executeSearchQuery({
      $,
      name: this.name,
    });
    $.export("$summary", `Executed Splunk search: ${this.name}`);
    return response;
  },
};
