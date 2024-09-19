import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-organization-access-control",
  name: "Gets Organization Access Control",
  description: "Gets an organization's access control information, given the organization urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control?context=linkedin/compliance/context#find-access-control-information)",
  version: "0.1.5",
  type: "action",
  props: {
    linkedin,
    organizationUrn: {
      type: "string",
      label: "Organization Urn",
      description: "The organizational entity for which the access control information is being retrieved. Must be in URN format urn:li:organization:{id}.",
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

    const params = `q=organization&organization=${this.organizationUrn.replace(/:/g, "%3A")}&count=${count}`;

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

    $.export("$summary", "Successfully retrieved access control information");

    return results;
  },
};
