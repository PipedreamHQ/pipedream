import talend from "../../talend.app.mjs";

export default {
  key: "talend-list-plan-executable-options",
  name: "List Plan Executable Options",
  description: "Retrieves available options for the Plan Executable field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    talend,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await talend.propDefinitions.planExecutable.options.call(this.talend, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
