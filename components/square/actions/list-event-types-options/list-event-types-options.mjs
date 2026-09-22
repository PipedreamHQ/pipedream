import square from "../../square.app.mjs";

export default {
  key: "square-list-event-types-options",
  name: "List Webhook Event Types Options",
  description: "Retrieves available options for the Webhook Event Types field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    square,
  },
  async run({ $ }) {
    const options = await square.propDefinitions.eventTypes.options.call(this.square);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
