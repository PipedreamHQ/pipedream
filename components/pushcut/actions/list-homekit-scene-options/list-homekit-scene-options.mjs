import { pushcut } from "../../pushcut.app.mjs";

export default {
  key: "pushcut-list-homekit-scene-options",
  name: "List Homekit Scene Options",
  description: "Retrieves available options for the Homekit Scene field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pushcut,
  },
  async run({ $ }) {
    const options = await pushcut.propDefinitions.homekitScene.options.call(this.pushcut, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
