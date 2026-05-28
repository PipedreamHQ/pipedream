import { oxylabs } from "../../oxylabs.app.mjs";

export default {
  key: "oxylabs-list-schedule-id-options",
  name: "List Schedule ID Options",
  description: "Retrieves available options for the Schedule ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    oxylabs,
  },
  async run({ $ }) {
    const options = await oxylabs.propDefinitions.scheduleId.options.call(this.oxylabs, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
