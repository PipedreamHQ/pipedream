import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-role-lookup",
  name: "Get Role Lookup",
  description: "Find the person who most closely matches a specified role in a company (e.g., the CTO of Apple). Cost: 3 credits per successful request. [See the documentation](https://enrichlayer.com/docs/api/v2/people-api/role-lookup).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    role: {
      type: "string",
      label: "Role",
      description: "The role/title to look up (e.g., `ceo`, `cto`, `vp of engineering`).",
    },
    companyName: {
      propDefinition: [
        enrichlayer,
        "companyName",
      ],
      description: "The name of the company to search within (e.g., `enrichlayer`).",
    },
    enrichProfile: {
      propDefinition: [
        enrichlayer,
        "enrichProfile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.getRoleLookup({
      $,
      params: {
        role: this.role,
        company_name: this.companyName,
        enrich_profile: this.enrichProfile,
      },
    });
    $.export("$summary", `Successfully found ${this.role} at ${this.companyName}`);
    return response;
  },
};
