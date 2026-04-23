import app from "../../ironclad.app.mjs";
import { parseValue } from "../../common/utils.mjs";

export default {
  key: "ironclad-update-record",
  name: "Update Record",
  description: "Updates properties on an existing Ironclad repository record."
    + " **When the record ID isn't known**, use **Search Records** first to find it."
    + " **Use Describe Workspace** to discover valid property keys and value shapes for the tenant."
    + " `properties` is a free-form JSON object keyed by property key. Example: `{\"counterpartyName\": \"Acme Corp\", \"contractValue\": {\"currency\": \"USD\", \"amount\": 50000}}`."
    + " [See the documentation](https://developer.ironcladapp.com/reference/update-a-record)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update. Obtain via **Search Records**.",
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "JSON object of property key-value pairs to set on the record."
        + " Example: `{\"counterpartyName\": \"Acme Corp\"}`. Use **Describe Workspace** to discover valid keys and value shapes.",
    },
  },
  async run({ $ }) {
    const parsedProperties = parseValue(this.properties) ?? {};

    const updates = Object.entries(parsedProperties).map(([
      path,
      value,
    ]) => ({
      action: "set",
      path,
      value,
    }));

    const response = await this.app.updateRecord({
      $,
      recordId: this.recordId,
      data: {
        updates,
      },
    });

    $.export("$summary", `Updated ${updates.length} property(ies) on record ${this.recordId}`);
    return response ?? {
      success: true,
      recordId: this.recordId,
    };
  },
};
