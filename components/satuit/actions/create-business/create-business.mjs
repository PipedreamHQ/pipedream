import satuit from "../../satuit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "satuit-create-business",
  name: "Create Business",
  description: "Creates a new business within the Satuit platform. [See the documentation]()", // Placeholder for docs link
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    satuit,
    businessName: {
      propDefinition: [
        satuit,
        "businessName",
      ],
    },
    industryType: {
      propDefinition: [
        satuit,
        "industryType",
      ],
    },
    businessDescription: {
      propDefinition: [
        satuit,
        "businessDescription",
      ],
      optional: true,
    },
    businessAddress: {
      propDefinition: [
        satuit,
        "businessAddress",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      Name: this.businessName,
      Industry: this.industryType,
      ...(this.businessDescription && {
        Description: this.businessDescription,
      }),
      ...(this.businessAddress && {
        Address: this.businessAddress,
      }),
    };

    const response = await this.satuit.createBusiness({
      data,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.satuit.$auth.oauth_access_token}`,
      },
    });

    $.export("$summary", `Successfully created new business: ${this.businessName}`);
    return response;
  },
};
