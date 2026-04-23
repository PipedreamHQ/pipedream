import app from "../../ironclad.app.mjs";

export default {
  key: "ironclad-get-record",
  name: "Get Record",
  description: "Returns the full detail of a single Ironclad repository record by ID."
    + " Use when the record ID is already known. **When the ID isn't known**, use **Search Records** first to find it."
    + " [See the documentation](https://developer.ironcladapp.com/reference/retrieve-a-record)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to retrieve. Obtain via **Search Records**.",
    },
    hydrateEntities: {
      type: "boolean",
      label: "Hydrate Entities",
      description: "When true, expand referenced entity fields in the response.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.hydrateEntities) params.hydrateEntities = true;

    const response = await this.app.getRecord({
      $,
      recordId: this.recordId,
      params,
    });

    $.export("$summary", `Retrieved record ${this.recordId}${response?.name
      ? `: ${response.name}`
      : ""}`);

    return response;
  },
};
