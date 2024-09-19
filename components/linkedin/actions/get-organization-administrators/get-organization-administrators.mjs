import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-organization-administrators",
  name: "Get Organization Administrators",
  description: "Gets the administator members of an organization, given the organization urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control?context=linkedin/compliance/context#find-organization-administrators)",
  version: "0.2.5",
  type: "action",
  props: {
    linkedin,
    organizationUrn: {
      type: "string",
      label: "Organization",
      description: "The organizational entity for which administrators are being retrieved. Must be in URN format urn:li:organization:{id}.",
    },
    max: {
      propDefinition: [
        linkedin,
        "max",
      ],
    },
  },
  async run({ $ }) {
    let start = 0;
    const count = 50;
    const results = [];

    const params = `q=organization&organization=${this.organizationUrn.replace(/:/g, "%3A")}&role=ADMINISTRATOR&state=APPROVED&count=${count}`;

    let done = false;
    do {
      const { data: { elements } } = await this.linkedin.getAccessControl({
        params: params + `&start=${start}`,
      });

      results.push(...elements);
      start += count;
      if (elements?.length < count) {
        done = true;
      }
    } while (results.length < this.max && !done);

    $.export("$summary", `Successfully retrieved ${results.length} organization administrator(s)`);

    return results;
  },
};
