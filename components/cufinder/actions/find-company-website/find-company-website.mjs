import cufinder from "../../cufinder.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cufinder-find-company-website",
  name: "Find Company Website",
  description: "Finds a company's website using the company name. [See the documentation](https://apidoc.cufinder.io/apis/#company-website-finder-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cufinder,
    companyName: {
      propDefinition: [
        cufinder,
        "companyName",
      ],
    },
    apiKey: {
      propDefinition: [
        cufinder,
        "apiKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cufinder.findCompanyWebsite({
      companyName: this.companyName,
    });
    $.export("$summary", `Found website for company: ${this.companyName}`);
    return response;
  },
};
