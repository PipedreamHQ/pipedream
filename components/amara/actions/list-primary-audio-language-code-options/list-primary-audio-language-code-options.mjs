import amara from "../../amara.app.mjs";

export default {
  key: "amara-list-primary-audio-language-code-options",
  name: "List Primary Audio Language Code Options",
  description: "Retrieves Available Options for the Primary Audio Language Code Field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    amara,
  },
  async run({ $ }) {
    const options = await amara.propDefinitions.primaryAudioLanguageCode.options.call(this.amara);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
