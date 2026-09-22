import vivocalendar from "../../vivocalendar.app.mjs";

export default {
  key: "vivocalendar-list-service-id-options",
  name: "List Service ID Options",
  description: "Retrieves available options for the Service ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vivocalendar,
  },
  async run({ $ }) {
    const options = await vivocalendar.propDefinitions.serviceId.options.call(this.vivocalendar);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
