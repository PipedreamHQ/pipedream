// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-get-record",
  name: "Get Record",
  description: "Retrieves a single Ironclad record by its ID, returning the record's name, type, properties, and metadata. Run **Search Records** first to find a valid record ID. Example: set `recordId` to `\"rec_abc123\"` to retrieve a record with fields such as `id`, `name`, `type`, and `properties`. [See the documentation](https://developer.ironcladapp.com/reference/retrieve-a-record)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    ironclad,
    recordId: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.ironclad.getRecord({
      $,
      recordId: this.recordId,
    });
    $.export("$summary", `Retrieved record ${this.recordId}`);
    return response;
  },
};
