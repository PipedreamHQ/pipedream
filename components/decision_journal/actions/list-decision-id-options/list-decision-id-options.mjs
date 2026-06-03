import decision_journal from "../../decision_journal.app.mjs";

export default {
  key: "decision_journal-list-decision-id-options",
  name: "List Decision ID Options",
  description: "Retrieves available options for the Decision ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    decision_journal,
  },
  async run({ $ }) {
    const options = await decision_journal.propDefinitions.decisionId.options
      .call(this.decision_journal, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
