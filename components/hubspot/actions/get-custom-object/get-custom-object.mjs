import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-custom-object",
  name: "Get Custom Object",
  description:
    "Fetch one or more custom object records by ID in a single request."
    + " Use **List Custom Objects** first to browse records and find the IDs you need,"
    + " then use this tool to retrieve full property details."
    + " Use **List Custom Object Schemas** to get the correct `objectType` identifier."
    + " Max 100 IDs per request."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/latest/crm/objects/objects/batch/get-objects)",
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
      propDefinition: [
        hubspot,
        "objectType",
      ],
      description:
        "The custom object type identifier — either the fullyQualifiedName (e.g. `p_pd_eval_movie`)"
        + " or the objectTypeId (e.g. `2-12345678`)."
        + " Use **List Custom Object Schemas** to discover available custom object types.",
    },
    objectIds: {
      type: "string[]",
      label: "Object IDs",
      description:
        "List of custom object record IDs to fetch. Min 1, max 100."
        + " Use **List Custom Objects** to discover record IDs.",
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description:
        "Property names to include in the results."
        + " If not specified, returns default properties."
        + " Use **List Custom Object Properties** to discover available property names.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      inputs: this.objectIds.map((id) => ({
        id,
      })),
    };

    if (this.properties?.length) {
      data.properties = this.properties;
    }

    const response = await this.hubspot.batchGetObjects({
      $,
      objectType: this.objectType,
      data,
    });

    const count = response?.results?.length ?? 0;
    $.export("$summary", `Retrieved ${count} ${this.objectType} record${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
