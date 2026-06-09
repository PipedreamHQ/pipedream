import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-custom-objects",
  name: "List Custom Objects",
  description:
    "List records of a custom object type with pagination and property selection."
    + " HubSpot does NOT support the /search endpoint for custom objects —"
    + " use this list action to browse records, then use **Get Custom Object** to fetch full details by ID."
    + " Use **List Custom Object Schemas** first to obtain the correct `objectType` identifier"
    + " (fullyQualifiedName or objectTypeId)."
    + " Use **List Custom Object Properties** to discover which properties are available to request."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/latest/crm/objects/objects/get-objects)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description:
        "The custom object type identifier — either the fullyQualifiedName (e.g. `p_pd_eval_movie`)"
        + " or the objectTypeId (e.g. `2-12345678`)."
        + " Use **List Custom Object Schemas** to discover available custom object types.",
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description:
        "Property names to include in the returned records."
        + " If not specified, only the default display property is returned."
        + " Use **List Custom Object Properties** to discover available property names.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return per page. Max: 100, default: 10.",
      optional: true,
      min: 1,
      max: 100,
      default: 10,
    },
    after: {
      type: "string",
      label: "After (Pagination Cursor)",
      description: "Paging cursor from a previous response for retrieving the next page of results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const requestParams = {
      limit: this.limit,
    };

    if (this.properties?.length) {
      requestParams.properties = this.properties.join(",");
    }

    const response = await this.hubspot.listObjectsInPage(
      this.objectType, this.after, requestParams, $,
    );

    const count = response?.results?.length ?? 0;
    $.export("$summary", `Listed ${count} ${this.objectType} record${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
