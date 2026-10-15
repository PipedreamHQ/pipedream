import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-selected-events-options",
  name: "List Selected Events Options",
  description: "Returns all Ironclad webhook event type names as `{label, value}` pairs. Call this to discover valid event types before configuring an Ironclad event source. Example return: `[{\"label\": \"WORKFLOW LAUNCHED\", \"value\": \"workflow_launched\"}, {\"label\": \"WORKFLOW UPDATED\", \"value\": \"workflow_updated\"}, ...]`. [See the documentation](https://developer.ironcladapp.com/reference/webhooks)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    ironclad,
  },
  async run({ $ }) {
    const options = await ironclad.propDefinitions.selectedEvents.options.call(this.ironclad);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
