import pushbullet from "../../pushbullet.app.mjs";

export default {
  key: "pushbullet-list-device-options",
  name: "List Device Options",
  description: "Retrieves available options for the Device field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pushbullet,
  },
  async run({ $ }) {
    const options = await pushbullet.propDefinitions.device.options.call(this.pushbullet);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
