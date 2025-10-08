import { ConfigurationError } from "@pipedream/platform";
import app from "../../hunter.app.mjs";

export default {
  key: "hunter-domain-search",
  name: "Domain Search",
  description: "Search all the email addresses corresponding to one website or company. [See the documentation](https://hunter.io/api-documentation/v2#domain-search).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    seniority: {
      type: "string[]",
      label: "Seniority",
      description: "Get only email addresses for people with the selected seniority level(s).",
      options: [
        "junior",
        "senior",
        "executive",
      ],
      optional: true,
    },
    department: {
      type: "string[]",
      label: "Department",
      description: "Get only email addresses for people working in the selected department(s).",
      options: [
        "executive",
        "it",
        "finance",
        "management",
        "sales",
        "legal",
        "support",
        "hr",
        "marketing",
        "communication",
        "education",
        "design",
        "health",
        "operations",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      domain,
      company,
      type,
      seniority,
      department,
      limit,
    } = this;

    if (!domain && !company) {
      throw new ConfigurationError("You must provide either a **Domain** or **Company** name");
    }

    const response = await app.domainSearch({
      $,
      params: {
        domain,
        company,
        type,
        ...(Array.isArray(seniority) && seniority.length && {
          seniority: seniority.join(","),
        }),
        ...(Array.isArray(department) && department.length && {
          department: department.join(","),
        }),
        limit,
      },
    });

    $.export("$summary", "Successfully searched for email addresses");
    return response;
  },
};
