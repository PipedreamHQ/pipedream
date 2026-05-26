import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-list-org-id-options",
  name: "List Organization ID Options",
  description: "Retrieves available options for the Organization ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    qntrl,
  },
  async run({ $ }) {
    const options = await qntrl.propDefinitions.orgId.options.call(this.qntrl);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
