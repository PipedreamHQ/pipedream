import accelo from "../../accelo.app.mjs";

export default {
  key: "accelo-list-company-id-options",
  name: "List Company ID Options",
  description: "Retrieves available options for the Company ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accelo,
  },
  async run({ $ }) {
    const options = await accelo.propDefinitions.companyId.options.call(this.accelo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
