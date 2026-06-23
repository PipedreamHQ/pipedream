import slybroadcast from "../../slybroadcast.app.mjs";

export default {
  key: "slybroadcast-list-audio-file-options",
  name: "List Audio File Options",
  description: "Retrieves available options for the Audio File field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slybroadcast,
  },
  async run({ $ }) {
    const options = await slybroadcast.propDefinitions.audioFile.options
      .call(this.slybroadcast, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
