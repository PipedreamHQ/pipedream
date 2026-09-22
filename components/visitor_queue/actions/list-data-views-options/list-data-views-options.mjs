import visitor_queue from "../../visitor_queue.app.mjs";

export default {
  key: "visitor_queue-list-data-views-options",
  name: "List Data Views Options",
  description: "Retrieves available options for the Data Views field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    visitor_queue,
  },
  async run({ $ }) {
    const options = await visitor_queue.propDefinitions.dataViews.options.call(this.visitor_queue);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
