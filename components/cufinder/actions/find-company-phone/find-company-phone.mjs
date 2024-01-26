import cufinder from "../../cufinder.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cufinder-find-company-phone",
  name: "Find Company Phone",
  description: "Find a company phone using the domain. [See the documentation](https://apidoc.cufinder.io/apis/#company-phone-finder-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cufinder,
    domain: {
      propDefinition: [
        cufinder,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cufinder.findCompanyPhone({
      domain: this.domain,
    });
    $.export("$summary", `Successfully found phone numbers for the domain: ${this.domain}`);
    return response;
  },
};
