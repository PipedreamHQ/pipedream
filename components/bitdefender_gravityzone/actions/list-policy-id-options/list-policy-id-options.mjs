import bitdefender_gravityzone from "../../bitdefender_gravityzone.app.mjs";

export default {
  key: "bitdefender_gravityzone-list-policy-id-options",
  name: "List Policy ID Options",
  description: "Retrieves available options for the Policy ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bitdefender_gravityzone,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await bitdefender_gravityzone.propDefinitions.policyId.options
      .call(this.bitdefender_gravityzone, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
