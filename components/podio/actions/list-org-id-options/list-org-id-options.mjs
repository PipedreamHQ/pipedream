import podio from "../../podio.app.mjs";

export default {
  key: "podio-list-org-id-options",
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
    podio,
  },
  async run({ $ }) {
    const options = await podio.propDefinitions.orgId.options.call(this.podio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
