import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-list-branch-id-options",
  name: "List Branch ID Options",
  description: "Retrieves available options for the Branch ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    forcemanager,
  },
  async run({ $ }) {
    const options = await forcemanager.propDefinitions.branchId.options.call(this.forcemanager);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
