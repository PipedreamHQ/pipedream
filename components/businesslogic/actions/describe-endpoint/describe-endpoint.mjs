import businesslogic from "../../businesslogic.app.mjs";

export default {
  key: "businesslogic-describe-endpoint",
  name: "Describe Endpoint",
  description: "Returns json schemas for input and output parameters of a webservice.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    businesslogic,
  },
  async run({ $ }) {
    const response = await this.businesslogic.describeEndpoint({
      $,
    });
    $.export("$summary", "Successfully retrieved webservice schemas.");
    return response;
  },
};
