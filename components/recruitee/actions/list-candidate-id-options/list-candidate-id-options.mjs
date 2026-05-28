import { recruitee } from "../../recruitee.app.mjs";

export default {
  key: "recruitee-list-candidate-id-options",
  name: "List Candidate ID Options",
  description: "Retrieves available options for the Candidate ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    recruitee,
  },
  async run({ $ }) {
    const options = await recruitee.propDefinitions.candidateId.options.call(this.recruitee, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
