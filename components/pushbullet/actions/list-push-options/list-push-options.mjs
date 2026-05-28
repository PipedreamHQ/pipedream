import { pushbullet } from "../../pushbullet.app.mjs";

export default {
  key: "pushbullet-list-push-options",
  name: "List Push Options",
  description: "Retrieves available options for the Push field.",
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
    const options = await pushbullet.propDefinitions.push.options.call(this.pushbullet, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
