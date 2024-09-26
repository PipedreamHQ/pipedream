import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-search-string",
  name: "Search Object Records",
  description:
    "Searches for records in an object using a parameterized search. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_search_parameterized_get.htm)",
  version: "0.0.2",
  type: "action",
  props: {
    salesforce,
    infoBox: {
      type: "alert",
      alertType: "info",
      content: "If you need a more flexible search, consider using the **SOQL Search** or **SOSL Search** actions instead.",
    },
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to search for records.",
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The term to search for.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description:
        "List of the Salesforce object's fields to get values from, such as `Id` or `Name`.",
    },
  },
  async run({ $ }) {
    const {
      sobjectType,
      searchTerm,
      fields,
    } = this;

    const response = await this.salesforce.parameterizedSearch({
      $,
      params: {
        q: searchTerm,
        sobject: sobjectType,
        fields: fields.join(","),
      },
    });
    const resultsFound = response.searchRecords.length;
    $.export("$summary", `Sucessfully found ${resultsFound} results`);
    return response;
  },
};
