import similarweb from "../../similarweb_digitalrank_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "similarweb_digitalrank_api-get-website-rank",
  name: "Get Website Rank",
  description: "Retrieves the global rank of a specific website using Similarweb's Digital Rank API. [See the documentation](https://developers.similarweb.com/docs/digital-rank-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    similarweb,
    domain: {
      propDefinition: [
        similarweb,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.similarweb.getWebsiteRank({
      domain: this.domain,
    });

    $.export("$summary", `Retrieved global rank for domain: ${this.domain}`);
    return response;
  },
};
