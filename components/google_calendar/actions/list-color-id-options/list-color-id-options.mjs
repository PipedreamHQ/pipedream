import google_calendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-list-color-id-options",
  name: "List Color ID Options",
  description: "Retrieves available options for the Color ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_calendar,
  },
  async run({ $ }) {
    const options = await google_calendar.propDefinitions.colorId.options
      .call(this.google_calendar);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
