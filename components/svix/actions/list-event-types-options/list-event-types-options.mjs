import svix from "../../svix.app.mjs";

export default {
  key: "svix-list-event-types-options",
  name: "List Event Types Options",
  description: "Retrieves available options for the Event Types field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    svix,
  },
  async run({ $ }) {
    const options = await svix.propDefinitions.eventTypes.options.call(this.svix);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
