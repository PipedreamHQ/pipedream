// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-record-type-options",
  name: "List Type Options",
  description: "Returns all Ironclad record type keys and their display names as `{label, value}` pairs (where `value` is the type key). Call this before setting the `type` field in **Create Record** to find valid type keys. Example return: `[{\"label\": \"Vendor Agreement\", \"value\": \"vendor_agreement\"}, {\"label\": \"NDA\", \"value\": \"nda\"}, ...]`. [See the documentation](https://developer.ironcladapp.com/reference/list-all-records-metadata)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ironclad,
  },
  async run({ $ }) {
    const options = await ironclad.propDefinitions.recordType.options.call(this.ironclad);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
