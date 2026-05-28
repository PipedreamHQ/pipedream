import exhibitday from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-list-event-id-options",
  name: "List Event ID Options",
  description: "Retrieves available options for the Event ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    exhibitday,
  },
  async run({ $ }) {
    const options = await exhibitday.propDefinitions.eventId.options.call(this.exhibitday, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
