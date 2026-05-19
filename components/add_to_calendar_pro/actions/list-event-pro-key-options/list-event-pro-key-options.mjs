import add_to_calendar_pro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-list-event-pro-key-options",
  name: "List Event Pro Key Options",
  description: "Retrieves available options for the Event Pro Key field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    add_to_calendar_pro,
  },
  async run({ $ }) {
    const options = await add_to_calendar_pro.propDefinitions.eventProKey.options
      .call(this.add_to_calendar_pro);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
