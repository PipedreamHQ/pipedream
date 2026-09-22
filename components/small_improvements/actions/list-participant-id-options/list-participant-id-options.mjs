import small_improvements from "../../small_improvements.app.mjs";

export default {
  key: "small_improvements-list-participant-id-options",
  name: "List Participant ID Options",
  description: "Retrieves available options for the Participant ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    small_improvements,
  },
  async run({ $ }) {
    const options = await small_improvements.propDefinitions.participantId.options
      .call(this.small_improvements);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
