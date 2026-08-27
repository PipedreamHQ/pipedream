// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-properties-options",
  name: "List Properties Options",
  description: "Returns all Ironclad record property keys and their display names (including the required `type` for each) as `{label, value}` pairs. Call this before setting the `properties` field in **Create Record** to find valid property keys and their exact type — do not guess a property's type. Example return: `[{\"label\": \"Counterparty Name (type: string)\", \"value\": \"counterpartyName\"}, {\"label\": \"Contract Value (type: monetary_amount)\", \"value\": \"contractValue\"}, ...]`. [See the documentation](https://developer.ironcladapp.com/reference/retrieve-records-metadata)",
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
    const { properties } = await this.ironclad.getRecordsSchema({
      $,
    });
    const options = Object.entries(properties).map(([
      key,
      value,
    ]) => ({
      value: key,
      label: `${value.displayName} (type: ${value.type})`,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
