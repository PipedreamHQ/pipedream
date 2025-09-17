import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-organization-administrators",
  name: "Get Organization Administrators",
  description: "Gets the administrator members of a selected organization. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control-by-role?view=li-lms-2025-01&tabs=http#find-organization-administrators)",
  version: "0.3.3",
  type: "action",
  props: {
    linkedin,
    organizationId: {
      propDefinition: [
        linkedin,
        "organizationId",
      ],
      description: "The ID of the organization for which administrators are being retrieved",
    },
  },
  async run({ $ }) {
    let start = 0;
    const count = 50;
    const results = [];

    const organizationUrn = `urn:li:organization:${this.organizationId}`;

    const params = `q=organization&organization=${organizationUrn.replace(/:/g, "%3A")}&role=ADMINISTRATOR&state=APPROVED&count=${count}`;

    let done = false;
    do {
      const { data: { elements } } = await this.linkedin.getAccessControl({
        strParams: params + `&start=${start}`,
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
