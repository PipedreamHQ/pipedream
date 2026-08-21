// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-create-record",
  name: "Create Record",
  description: "Creates a new record in Ironclad. Provide `properties` as a JSON object where each key maps to a `{type, value}` wrapper. Run **Describe Workspace** first to see all valid record types and property keys (with their required `type`) in one call; **List Type Options** / **List Properties Options** exist only to resolve a single value for this action's props, not for general discovery. Property types are snake_case, e.g. `string`, `number`, `monetary_amount`, `address`, `date`, `duration`, `boolean` — **not** the camelCase types used by workflow attributes. Complex types use nested objects: `monetary_amount` `{\"currency\": \"USD\", \"amount\": 25.37}`, `address` `{\"lines\": [\"325 5th Street\", \"Suite 200\"], \"locality\": \"San Francisco\", \"region\": \"California\", \"postcode\": \"94107\", \"country\": \"USA\"}`. Example: set `recordName` to `\"Acme NDA\"`, `recordType` to `\"vendor_agreement\"`, and `properties` to `{\"counterpartyName\": {\"type\": \"string\", \"value\": \"Acme Corp\"}, \"contractValue\": {\"type\": \"monetary_amount\", \"value\": {\"currency\": \"USD\", \"amount\": 50000}}}`; returns `{\"id\": \"rec_abc123\", \"name\": \"Acme NDA\"}`. [See the documentation](https://developer.ironcladapp.com/reference/create-a-record)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ironclad,
    recordName: {
      type: "string",
      label: "Name",
      description: "Name of the record.",
    },
    recordType: {
      propDefinition: [
        ironclad,
        "recordType",
      ],
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "JSON object of property key to `{type, value}` wrapper pairs. Run **Describe Workspace** first to discover valid keys and their exact required `type` (e.g. `string`, `number`, `boolean`, `monetary_amount`, `address`, `date`, `duration`) — do not guess the type. Example: `{\"counterpartyName\": {\"type\": \"string\", \"value\": \"Acme Corp\"}, \"contractValue\": {\"type\": \"monetary_amount\", \"value\": {\"currency\": \"USD\", \"amount\": 50000}}}`.",
    },
    links: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      type: "string[]",
      label: "Links",
      description: "Array of record IDs to link to the new record. Run **Search Records** first to find valid record IDs.",
      optional: true,
    },
    parent: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      label: "Parent",
      description: "Record ID to set as the parent of this record. Run **Search Records** first to find valid record IDs.",
      optional: true,
    },
    children: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      type: "string[]",
      label: "Children",
      description: "Array of record IDs to set as child records. Run **Search Records** first to find valid record IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const properties = JSON.parse(this.properties);

    const response = await this.ironclad.createRecord({
      $,
      data: {
        name: this.recordName,
        type: this.recordType,
        links: this.links?.length
          ? this.links.map((link) => ({
            recordId: link,
          }))
          : undefined,
        parent: this.parent
          ? {
            recordId: this.parent,
          }
          : undefined,
        children: this.children?.length
          ? this.children.map((child) => ({
            recordId: child,
          }))
          : undefined,
        properties,
      },
    });
    $.export("$summary", `Created record with ID: ${response.id}`);
    return response;
  },
};
