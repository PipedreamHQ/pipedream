// vandelay-test-dr
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-text-search",
  name: "Text Search",
  description:
    "Search Salesforce records by keyword across multiple object types simultaneously."
    + " Use for free-text search when the user mentions a name, term, or keyword without specifying an object type."
    + " Use **SOQL Query** instead for structured queries on a single object type with specific conditions."
    + " Results are grouped by object type.",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salesforce,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description:
        "The text to search for across Salesforce records."
        + " Searches name fields and other indexed text fields.",
    },
    objectTypes: {
      type: "string[]",
      label: "Object Types",
      description:
        "SObject types to search. Default: Account, Contact, Lead, Opportunity."
        + " Example: `[\"Account\", \"Contact\", \"Case\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const objectTypes = this.objectTypes?.length
      ? this.objectTypes
      : [
        "Account",
        "Contact",
        "Lead",
        "Opportunity",
      ];

    const returningClause = objectTypes
      .map((type) => `${type}(Id, Name)`)
      .join(", ");

    const escapedTerm = this.searchTerm.replace(/[?&|!{}[\]()^~*:\\"'+-]/g, "\\$&");
    const sosl = `FIND {${escapedTerm}} IN ALL FIELDS RETURNING ${returningClause}`;

    const response = await this.salesforce.search({
      $,
      search: sosl,
    });

    const results = response.searchRecords || [];
    const groupedByType = {};
    for (const record of results) {
      const type = record.attributes?.type || "Unknown";
      if (!groupedByType[type]) groupedByType[type] = [];
      groupedByType[type].push(record);
    }

    const summary = Object.entries(groupedByType)
      .map(([
        type,
        records,
      ]) => `${records.length} ${type}`)
      .join(", ");

    $.export(
      "$summary",
      results.length
        ? `Found ${results.length} result${results.length === 1
          ? ""
          : "s"}: ${summary}`
        : `No results found for "${this.searchTerm}"`,
    );

    return {
      totalSize: results.length,
      searchRecords: results,
      groupedByType,
    };
  },
};
