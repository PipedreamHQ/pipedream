import oracle_cloud_infrastructure from "../../oracle_cloud_infrastructure.app.mjs";

export default {
  key: "oracle_cloud_infrastructure-list-compartment-id-options",
  name: "List Compartment ID Options",
  description: "Retrieves available options for the Compartment ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    oracle_cloud_infrastructure,
  },
  async run({ $ }) {
    const options = await oracle_cloud_infrastructure.propDefinitions.compartmentId.options
      .call(this.oracle_cloud_infrastructure);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
