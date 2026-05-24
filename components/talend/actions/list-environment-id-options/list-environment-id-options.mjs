import talend from "../../talend.app.mjs";

export default {
  key: "talend-list-environment-id-options",
  name: "List Environment Options",
  description: "Retrieves available options for the Environment field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    talend,
  },
  async run({ $ }) {
    const options = await talend.propDefinitions.environmentId.options.call(this.talend);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
