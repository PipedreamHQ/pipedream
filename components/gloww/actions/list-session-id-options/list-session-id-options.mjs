import { gloww } from "../../gloww.app.mjs";

export default {
  key: "gloww-list-session-id-options",
  name: "List Session ID Options",
  description: "Retrieves available options for the Session ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gloww,
  },
  async run({ $ }) {
    const options = await gloww.propDefinitions.sessionId.options.call(this.gloww, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
