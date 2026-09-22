import lmnt from "../../lmnt.app.mjs";

export default {
  key: "lmnt-list-voice-options",
  name: "List Voice Options",
  description: "Retrieves available options for the Voice field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lmnt,
  },
  async run({ $ }) {
    const options = await lmnt.propDefinitions.voice.options.call(this.lmnt, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
