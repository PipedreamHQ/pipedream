import eventbrite from "../../eventbrite.app.mjs";

export default {
  key: "eventbrite-list-timezone-options",
  name: "List Timezone Options",
  description: "Retrieves available options for the Timezone field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    eventbrite,
  },
  async run({ $ }) {
    const options = await eventbrite.propDefinitions.timezone.options.call(this.eventbrite);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
