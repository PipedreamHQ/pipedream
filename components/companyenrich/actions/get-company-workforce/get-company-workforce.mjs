import companyenrich from "../../companyenrich.app.mjs";
import {
  companyId, stringValue,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-get-company-workforce",
  name: "Get Company Workforce",
  description: "Retrieve one 12-month page of workforce history for a company ID or domain. Costs 5 credits per successful page. Pass nextCursor from this action or a workforce expansion to retrieve an earlier year for the same company. [See the documentation](https://docs.companyenrich.com/reference/get_v2-companies-workforce)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    companyId: {
      propDefinition: [
        companyenrich,
        "companyId",
      ],
      optional: true,
    },
    domain: {
      propDefinition: [
        companyenrich,
        "domain",
      ],
      optional: true,
    },
    cursor: {
      propDefinition: [
        companyenrich,
        "cursor",
      ],
      description: "Opaque nextCursor from **Get Company Workforce** or a workforce expansion. Example: `eyJ...`. Keep the same company; omit for the latest 12 months.",
    },
  },
  async run({ $ }) {
    const idValue = this.companyId
      ? companyId(this.companyId)
      : undefined;
    const domainValue = stringValue(this.domain, "Domain", 1024);
    if (Boolean(idValue) === Boolean(domainValue)) {
      throw new ConfigurationError("Provide exactly one Company ID or Domain.");
    }
    const response = await this.companyenrich.getCompanyWorkforce({
      $,
      params: {
        id: idValue,
        domain: domainValue,
        cursor: stringValue(this.cursor, "Cursor", 1024),
      },
    });
    $.export("$summary", "Retrieved one page of company workforce history");
    return response;
  },
};
