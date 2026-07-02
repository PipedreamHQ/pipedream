import axonaut from "../../axonaut.app.mjs";

export default {
  key: "axonaut-list-company-id-options",
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
    axonaut,
  },
  async run({ $ }) {
    const options = await axonaut.propDefinitions.companyId.options.call(this.axonaut, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
