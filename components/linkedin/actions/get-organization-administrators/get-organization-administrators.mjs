import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-organization-administrators",
  name: "Get Organization Administrators",
  description: "Gets the administator members of an organization, given the organization urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control?context=linkedin/compliance/context#find-organization-administrators)",
  version: "0.2.2",
  type: "action",
  props: {
    linkedin,
    organizationUrn: {
      type: "string",
      label: "Organization",
      description: "The organizational entity for which administrators are being retrieved. Must be in URN format urn:li:organization:{id}.",
    },
    start: {
      type: "integer",
      label: "Start",
      description: "The index of the first item you want results for.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "The number of items you want included on each page of results.  Note that there may be less remaining items than the value you specify here.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      q: "organization",
      organization: encodeURI(this.organizationUrn),
      role: "ADMINISTRATOR",
      state: "APPROVED",
      start: this.start,
      count: this.count,
    };

    const response = await this.linkedin.getAccessControl({
      $,
      params,
    });

    $.export("$summary", "Successfully retrieved organization administrators");

    return response;
  },
};
