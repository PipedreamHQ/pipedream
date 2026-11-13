import companyenrich from "../../companyenrich.app.mjs";
import {
  companyId, stringValue,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-get-company-workforce",
  name: "Get Company Workforce",
  description: "Retrieve 12-month pages of workforce history for a company ID or domain. Defaults to one page; increase **Maximum Pages** for earlier years at 5 credits per successful page. Pass nextCursor from this action or a workforce expansion to retrieve an earlier year for the same company. [See the documentation](https://docs.companyenrich.com/reference/get_v2-companies-workforce)",
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
    maxPages: {
      propDefinition: [
        companyenrich,
        "maxPages",
      ],
    },
    cursor: {
      propDefinition: [
        companyenrich,
        "cursor",
      ],
      description: "Opaque nextCursor from **Get Company Workforce** or a workforce expansion. Example: `eyJ...`. Keep the same company; omit for the latest 12 months.",
    },
  },
  /**
   * Require exactly one company identifier and collect bounded workforce history pages.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The original page or collected pages with their continuation cursor.
   */
  async run({ $ }) {
    const idValue = this.companyId
      ? companyId(this.companyId)
      : undefined;
    const domainValue = stringValue(this.domain, "Domain", 1024);
    if (Boolean(idValue) === Boolean(domainValue)) {
      throw new ConfigurationError("Provide exactly one Company ID or Domain.");
    }
    const response = await this.companyenrich.collectPages({
      $,
      method: "getCompanyWorkforce",
      maxPages: this.maxPages,
      params: {
        id: idValue,
        domain: domainValue,
        cursor: stringValue(this.cursor, "Cursor", 1024),
      },
    });
    const completion = response.partial
      ? "; partial results returned at the pagination time limit"
      : "";
    $.export("$summary", `Retrieved ${response.pages?.length ?? 1} page(s) of company workforce history${completion}`);
    return response;
  },
};
