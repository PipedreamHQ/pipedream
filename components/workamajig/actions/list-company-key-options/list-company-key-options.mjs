import workamajig from "../../workamajig.app.mjs";

export default {
  key: "workamajig-list-company-key-options",
  name: "List Company Key Options",
  description: "Retrieves available options for the Company Key field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    workamajig,
  },
  async run({ $ }) {
    const options = await workamajig.propDefinitions.companyKey.options.call(this.workamajig);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
