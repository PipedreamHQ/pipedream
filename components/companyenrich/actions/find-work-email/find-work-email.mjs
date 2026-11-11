import companyenrich from "../../companyenrich.app.mjs";
import {
  personId, stringValue,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-find-work-email",
  name: "Find Work Email (Beta)",
  description: "Resolve a work email for a person from **Search People**. Beta: provider behavior may change. Costs 10 credits for a newly accessed found email. Returns found, not-found, unavailable or pending without automatic polling; an email is present only when found. [See the documentation](https://docs.companyenrich.com/reference/get_v2-people-personid-email)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    personId: {
      propDefinition: [
        companyenrich,
        "personId",
      ],
    },
    domain: {
      propDefinition: [
        companyenrich,
        "domain",
      ],
      optional: true,
      description: "A current or past company domain from the person profile, e.g. `example.com`. If omitted, current-company domains are tried in seniority order. A supplied domain must belong to one of the person\u2019s companies.",
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.findWorkEmail({
      $,
      personId: personId(this.personId),
      params: {
        domain: stringValue(this.domain, "Domain", 1024),
      },
    });
    $.export("$summary", `Work email lookup status: ${response.status}`);
    return response;
  },
};
