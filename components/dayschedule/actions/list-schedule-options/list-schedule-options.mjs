import dayschedule from "../../dayschedule.app.mjs";

export default {
  key: "dayschedule-list-schedule-options",
  name: "List Schedule Options",
  description: "Retrieves available options for the Schedule field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dayschedule,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dayschedule.propDefinitions.schedule.options.call(this.dayschedule, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
