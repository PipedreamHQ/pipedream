import companyenrich from "../../companyenrich.app.mjs";
import {
  stringValue, companyExpansions,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-enrich-company-by-properties",
  name: "Enrich Company by Properties",
  description: "Resolve a company from its name or social identifiers. Uses the best match; review identity before updating a CRM. Costs 1 credit when returned or when identifiers cannot resolve a domain, plus returned paid expansions. [See the documentation](https://docs.companyenrich.com/reference/post_v2-companies-enrich)",
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
    name: {
      "type": "string",
      "label": "Company Name",
      "description": "Company name to match, e.g. `Acme`. Supply at least one company identifier.",
      "optional": true,
    },
    linkedinUrl: {
      "type": "string",
      "label": "LinkedIn URL",
      "description": "Company profile URL, e.g. `https://www.linkedin.com/company/acme/`.",
      "optional": true,
    },
    linkedinId: {
      "type": "string",
      "label": "LinkedIn ID",
      "description": "Known company LinkedIn ID, e.g. `12345`, obtained from the company LinkedIn profile.",
      "optional": true,
    },
    twitterUrl: {
      "type": "string",
      "label": "Twitter / X URL",
      "description": "Company profile URL, e.g. `https://x.com/acme`.",
      "optional": true,
    },
    facebookUrl: {
      "type": "string",
      "label": "Facebook URL",
      "description": "Company page URL, e.g. `https://www.facebook.com/acme`.",
      "optional": true,
    },
    instagramUrl: {
      "type": "string",
      "label": "Instagram URL",
      "description": "Company profile URL, e.g. `https://www.instagram.com/acme/`.",
      "optional": true,
    },
    youtubeUrl: {
      "type": "string",
      "label": "YouTube URL",
      "description": "Company channel URL, e.g. `https://www.youtube.com/@acme`.",
      "optional": true,
    },
    companyExpand: {
      propDefinition: [
        companyenrich,
        "companyExpand",
      ],
    },
  },
  async run({ $ }) {
    const identifiers = {
      name: stringValue(this.name, "Company Name", 250),
      linkedinUrl: stringValue(this.linkedinUrl, "LinkedIn URL", 2048),
      linkedinId: stringValue(this.linkedinId, "LinkedIn ID", 100),
      twitterUrl: stringValue(this.twitterUrl, "Twitter / X URL", 2048),
      facebookUrl: stringValue(this.facebookUrl, "Facebook URL", 2048),
      instagramUrl: stringValue(this.instagramUrl, "Instagram URL", 2048),
      youtubeUrl: stringValue(this.youtubeUrl, "YouTube URL", 2048),
    };
    if (!Object.values(identifiers).some((value) => value !== undefined)) {
      throw new ConfigurationError("Provide at least one company name or social identifier.");
    }
    const response = await this.companyenrich.enrichCompanyByProperties({
      $,
      data: {
        ...identifiers,
        expand: companyExpansions(this.companyExpand),
      },
    });
    $.export("$summary", `Resolved company ${response.domain ?? response.id ?? "record"}`);
    return response;
  },
};
