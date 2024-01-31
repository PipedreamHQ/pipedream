import salesForceRestApi from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-search-records",
  name: "Search Object Records",
  description:
    "Searches for records in an object using a parameterized search. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_search_parameterized.htm)",
  version: "0.0.1",
  type: "action",
  props: {
    salesForceRestApi,
    sobjectType: {
      propDefinition: [
        salesForceRestApi,
        "objectType",
      ],
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The term to search for.",
    },
    fields: {
      type: "string[]",
      label: "Fields to get values from",
      description:
        "List of the Salesforce object's fields to get values from.",
    },
  },
  async run({ $ }) {
    const {
      sobjectType,
      searchTerm,
      fields,
    } = this;
    try {
      const response = await this.salesForceRestApi.parameterizedSearch(
        sobjectType, searchTerm, {
          fields: fields.join(","),
        },
      );
        const resultsFound = response.searchRecords.length;
      $.export("$summary", "Search completed successfully");
      $.export("results_found", resultsFound);
      return response;
    } catch (error) {
      console.error(error);
      $.export("$summary", "Search failed");
      $.export("results_found", 0);
      throw new Error(`Search failed: ${error.message}`);
    }
  },
};