import icypeas from "../../icypeas.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "icypeas-domain-search",
  name: "Domain or Company Search",
  description: "Performs a search using a domain or company name as input. At least one must be specified. [See the documentation]()",
  version: "0.0.1",
  type: "action",
  props: {
    icypeas,
    domainName: {
      propDefinition: [
        icypeas,
        "domainName",
      ],
    },
    companyName: {
      propDefinition: [
        icypeas,
        "companyName",
      ],
    },
  },
  async run({ $ }) {
    if (!this.domainName && !this.companyName) {
      throw new Error("You must provide either a domain name or a company name.");
    }
    const response = await this.icypeas.performSearch({
      domainName: this.domainName,
      companyName: this.companyName,
    });
    $.export("$summary", `Search completed for ${this.domainName || this.companyName}`);
    return response;
  },
};
