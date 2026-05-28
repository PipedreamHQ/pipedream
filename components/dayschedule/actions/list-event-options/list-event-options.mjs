import { dayschedule } from "../../dayschedule.app.mjs";

export default {
  key: "dayschedule-list-event-options",
  name: "List Event Options",
  description: "Retrieves available options for the Event field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dayschedule,
  },
  async run({ $ }) {
    const options = await dayschedule.propDefinitions.event.options.call(this.dayschedule, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
