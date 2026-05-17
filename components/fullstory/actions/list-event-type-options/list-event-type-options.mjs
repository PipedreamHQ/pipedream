import fullstory from "../../fullstory.app.mjs";

export default {
  key: "fullstory-list-event-type-options",
  name: "List Event Type Options",
  description: "Retrieves available options for the Event Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fullstory,
  },
  async run({ $ }) {
    const options = await fullstory.propDefinitions.eventType.options.call(this.fullstory);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
