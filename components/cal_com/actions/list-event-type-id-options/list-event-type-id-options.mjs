import cal_com from "../../cal_com.app.mjs";

export default {
  key: "cal_com-list-event-type-id-options",
  name: "List Event Type ID Options",
  description: "Retrieves available options for the Event Type ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cal_com,
  },
  async run({ $ }) {
    const options = await cal_com.propDefinitions.eventTypeId.options.call(this.cal_com);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
