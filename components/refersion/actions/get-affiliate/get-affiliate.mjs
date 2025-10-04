import app from "../../refersion.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Get Affiliate",
  description: "Get information about an affiliate. You can get an affiliate's information using their ID or code. [See the docs here](https://www.refersion.dev/reference/get_affiliate)",
  key: "refersion-get-affiliate",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "affiliateId",
      ],
    },
    affiliateCode: {
      type: "string",
      label: "Affiliate Code",
      description: "The Refersion affiliate identifier. You would have captured this from the affiliate/new endpoint response.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.id && !this.affiliateCode) {
      throw new ConfigurationError("You must provide either an ID or an affiliate code");
    }

    if (this.id && this.affiliateCode) {
      throw new ConfigurationError("You must provide either an ID or an affiliate code, not both");
    }

    const data = {};
    if (this.id) {
      data.id = this.id;
    }

    if (this.affiliateCode) {
      data.affiliate_code = this.affiliateCode;
    }
    const res = await this.app.getAffiliate(data, $);
    if (res.error) {
      throw new ConfigurationError(res.error);
    }
    $.export("$summary", "Affiliate successfully fetched");
    return res;
  },
};
