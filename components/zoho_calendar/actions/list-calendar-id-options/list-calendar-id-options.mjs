import zoho_calendar from "../../zoho_calendar.app.mjs";

export default {
  key: "zoho_calendar-list-calendar-id-options",
  name: "List Calendar ID Options",
  description: "Retrieves available options for the Calendar ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_calendar,
  },
  async run({ $ }) {
    const options = await zoho_calendar.propDefinitions.calendarId.options.call(this.zoho_calendar);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
