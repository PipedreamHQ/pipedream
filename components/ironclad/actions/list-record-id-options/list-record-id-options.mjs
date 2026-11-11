import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-record-id-options",
  name: "List Record ID Options",
  description: "Returns one page of Ironclad records as `{label, value}` pairs (where `value` is the record ID). Call this before using the `links`, `parent`, or `children` fields in **Create Record** to find valid record IDs. **Search Records** is the primary way to find a record by attribute values; use this action only to page through the full list or when resolving a record ID field directly. Results are 0-indexed by page; if the response contains the maximum number of items, increment `page` and call again to fetch more. Example return: `[{\"label\": \"Acme NDA\", \"value\": \"rec_abc123\"}, ...]`. [See the documentation](https://developer.ironcladapp.com/reference/list-records)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ironclad,
    page: {
      type: "integer",
      label: "Page",
      description: "The 0-indexed page of results to retrieve. Increment and call again if the previous response contained the maximum number of items.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ironclad.propDefinitions.recordId.options.call(this.ironclad, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
