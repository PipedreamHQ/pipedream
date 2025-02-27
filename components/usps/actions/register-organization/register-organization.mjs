import usps from "../../usps.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "usps-register-organization",
  name: "Register Organization",
  description: "Registers an organization to do business with the USPS. [See the documentation](https://developer.usps.com/api/57#tag/resources/operation/post-organizations)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    usps,
    organizationDetails: {
      propDefinition: [
        usps,
        "organizationDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.usps.registerOrganization({
      organizationDetails: this.organizationDetails,
    });

    $.export("$summary", "Organization registered successfully");
    return response;
  },
};
