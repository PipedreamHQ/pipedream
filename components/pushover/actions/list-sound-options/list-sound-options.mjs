import pushover from "../../pushover.app.mjs";

export default {
  key: "pushover-list-sound-options",
  name: "List Sound Options",
  description: "Retrieves available options for the Sound field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pushover,
  },
  async run({ $ }) {
    const options = await pushover.propDefinitions.sound.options.call(this.pushover);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
