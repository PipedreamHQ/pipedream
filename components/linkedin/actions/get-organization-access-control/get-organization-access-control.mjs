import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-organization-access-control",
  name: "Gets Organization Access Control",
  description: "Gets a selected organization's access control information. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control-by-role?view=li-lms-2025-01&tabs=http#find-organization-access-control)",
  version: "0.2.3",
  type: "action",
  props: {
    linkedin,
    organizationId: {
      propDefinition: [
        linkedin,
        "organizationId",
      ],
      description: "The ID of the organization for which the access control information is being retrieved",
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

    const organizationUrn = `urn:li:organization:${this.organizationId}`;

    const params = `q=organization&organization=${organizationUrn.replace(/:/g, "%3A")}&count=${count}`;

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

    $.export("$summary", "Successfully retrieved access control information");

    return results;
  },
};
