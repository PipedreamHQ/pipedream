import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-list-company-options",
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
    magnetic,
  },
  async run({ $ }) {
    const options = await magnetic.propDefinitions.company.options.call(this.magnetic);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
