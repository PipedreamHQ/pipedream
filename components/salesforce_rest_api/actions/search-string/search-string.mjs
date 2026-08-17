// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-search-string",
  name: "Search Object Records",
  description: "Search for records of one object type using a parameterized SOSL search."
    + " Use **Text Search** to search across several object types at once, or **SOQL Query** for exact field filters."
    + " SOSL matches indexed text fields, so it finds partial words but will not filter on numeric or date criteria."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_search_parameterized_get.htm)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      description: "The type of object to search for records",
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The term to search for",
    },
    fields: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
    },
  },
  methods: {
    // constructs a url that users can copy into a browser to view the record in Salesforce
    createBrowserUrl(baseUrl, url) {
      return `${baseUrl.replace(".my.salesforce.com", ".lightning.force.com")}/lightning/r/${url.match(/sobjects\/([^/]+)\/([^/]+)/).slice(1)
        .join("/")}/view`;
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
    const baseUrl = this.salesforce._baseApiUrl();
    response.searchRecords = response.searchRecords.map((record) => {
      const url = record?.attributes?.url;
      if (!url) return record;
      return {
        ...record,
        attributes: {
          ...record.attributes,
          url: `${baseUrl}${url}`, // api url
          browserUrl: this.createBrowserUrl(baseUrl, url),
        },
      };
    });
    $.export("$summary", `Successfully found ${resultsFound} result${resultsFound === 1
      ? ""
      : "s"}`);
    return response;
  },
};
