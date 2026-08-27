// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";
import { parseJsonObject } from "../../common/utils.mjs";

export default {
  key: "ironclad-update-record",
  name: "Update Record",
  description: "Updates properties on an existing Ironclad record. Provide `properties` as a JSON object where each key maps to a `{type, value}` wrapper — the same shape as **Create Record**. Run **Search Records** first to find the `recordId`, and **Describe Workspace** to discover valid property keys and their exact required `type` (record property types are snake_case, e.g. `string`, `number`, `monetary_amount`, `address`, `date`, `duration`, `boolean` — do not guess). Only the properties you include are changed; omitted properties are left as-is. Example: set `recordId` to `\"rec_abc123\"` and `properties` to `{\"contractValue\": {\"type\": \"monetary_amount\", \"value\": {\"currency\": \"USD\", \"amount\": 75000}}}`; returns the updated record. [See the documentation](https://developer.ironcladapp.com/reference/replace-a-record)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ironclad,
    recordId: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      optional: false,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "JSON object of property key to `{type, value}` wrapper pairs to update. Run **Describe Workspace** first to discover valid keys and their exact required `type` — do not guess the type. Example: `{\"contractValue\": {\"type\": \"monetary_amount\", \"value\": {\"currency\": \"USD\", \"amount\": 75000}}}`.",
    },
  },
  async run({ $ }) {
    const properties = parseJsonObject(this.properties, "Properties");

    const response = await this.ironclad.updateRecord({
      $,
      recordId: this.recordId,
      data: {
        addProperties: properties,
      },
    });
    $.export("$summary", `Updated record ${this.recordId}`);
    return response;
  },
};
