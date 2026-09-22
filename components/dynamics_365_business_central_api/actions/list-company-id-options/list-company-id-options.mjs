import dynamics_365_business_central_api from "../../dynamics_365_business_central_api.app.mjs";

export default {
  key: "dynamics_365_business_central_api-list-company-id-options",
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
    dynamics_365_business_central_api,
  },
  async run({ $ }) {
    const options = await dynamics_365_business_central_api.propDefinitions.companyId.options
      .call(this.dynamics_365_business_central_api);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
