import microsoft_outlook_calendar from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-list-time-zone-options",
  name: "List Time Zone Options",
  description: "Retrieves available options for the Time Zone field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoft_outlook_calendar,
  },
  async run({ $ }) {
    const options = await microsoft_outlook_calendar.propDefinitions.timeZone.options
      .call(this.microsoft_outlook_calendar);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
