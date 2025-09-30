import bitdefender from "../../bitdefender_gravityzone.app.mjs";

export default {
  key: "bitdefender_gravityzone-get-policy-details",
  name: "Get Policy Details",
  description: "Retrieve details about a specific policy. [See the documentation](https://www.bitdefender.com/business/support/en/77209-135304-getpolicydetails.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bitdefender,
    policyId: {
      propDefinition: [
        bitdefender,
        "policyId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bitdefender.getPolicyDetails({
      $,
      data: {
        params: {
          policyId: this.policyId,
        },
      },
    });

    $.export("$summary", `Successfully retrieved details for policy ${this.policyId}`);
    return response;
  },
};
