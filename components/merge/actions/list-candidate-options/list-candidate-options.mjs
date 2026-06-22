import merge from "../../merge.app.mjs";

export default {
  key: "merge-list-candidate-options",
  name: "List Candidate Options",
  description: "Retrieves available options for the Candidate field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    merge,
  },
  async run({ $ }) {
    const options = await merge.propDefinitions.candidate.options.call(this.merge, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
