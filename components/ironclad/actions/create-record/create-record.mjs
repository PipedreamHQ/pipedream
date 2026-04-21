import app from "../../ironclad.app.mjs";
import { parseValue } from "../../common/utils.mjs";

export default {
  key: "ironclad-create-record",
  name: "Create Record",
  description: "Creates a new record in the Ironclad repository."
    + " **Call Describe Workspace first** to discover valid record `type` keys and `properties` keys for the tenant."
    + " `properties` is a free-form JSON object keyed by property key. Property values follow the same shapes as workflow attributes — `monetaryAmount` → `{currency, amount}`, `address` → `{lines, locality, region, postcode, country}`, `date` → ISO 8601 string, etc."
    + " `links`, `parent`, and `children` accept record ID strings (or an array of IDs)."
    + " [See the documentation](https://developer.ironcladapp.com/reference/create-a-record)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "The record type key (e.g., `nda`, `msa`). Obtain valid keys from **Describe Workspace** (`recordTypes`).",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the record.",
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Optional JSON object of property key-value pairs."
        + " Example: `{\"counterpartyName\": \"Acme Corp\", \"effectiveDate\": \"2026-01-01T00:00:00Z\"}`. Use **Describe Workspace** to discover valid keys and expected value shapes.",
      optional: true,
    },
    links: {
      type: "string[]",
      label: "Links",
      description: "Optional array of record IDs to link to this record.",
      optional: true,
    },
    parent: {
      type: "string",
      label: "Parent",
      description: "Optional record ID to set as the parent of this record.",
      optional: true,
    },
    children: {
      type: "string[]",
      label: "Children",
      description: "Optional array of record IDs to set as children of this record.",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedProperties = parseValue(this.properties) ?? {};

    const { properties: schema } = await this.app.getRecordsSchema({
      $,
    });

    const propertiesData = {};
    for (const [
      key,
      value,
    ] of Object.entries(parsedProperties)) {
      propertiesData[key] = {
        type: schema?.[key]?.type,
        value,
      };
    }

    const data = {
      name: this.name,
      type: this.type,
      properties: propertiesData,
    };
    if (this.links?.length) {
      data.links = this.links.map((recordId) => ({
        recordId,
      }));
    }
    if (this.parent) {
      data.parent = {
        recordId: this.parent,
      };
    }
    if (this.children?.length) {
      data.children = this.children.map((recordId) => ({
        recordId,
      }));
    }

    const response = await this.app.createRecord({
      $,
      data,
    });

    $.export("$summary", `Created record ${response?.id ?? ""}: ${this.name}`);
    return response;
  },
};
