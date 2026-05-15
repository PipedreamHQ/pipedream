import breezy_hr from "../../breezy_hr.app.mjs";

export default {
  key: "breezy_hr-list-company-id-options",
  name: "List Company Options",
  description: "Retrieves available options for the Company field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    breezy_hr,
  },
  async run({ $ }) {
    const options = await breezy_hr.propDefinitions.companyId.options.call(this.breezy_hr);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
