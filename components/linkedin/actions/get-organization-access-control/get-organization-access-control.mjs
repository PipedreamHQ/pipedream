import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-organization-access-control",
  name: "Gets Organization Access Control",
  description: "Gets an organization's access control information, given the organization urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control?context=linkedin/compliance/context#find-access-control-information)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    organizationUrn: {
      type: "string",
      label: "Organization Urn",
      description: "The organizational entity for which the access control information is being retrieved. Must be in URN format urn:li:organization:{id}.",
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
      start: this.start,
      count: this.count,
    };

    const response = await this.linkedin.getAccessControl({
      $,
      params,
    });

    $.export("$summary", "Successfully retrieved access control information");

    return response;
  },
};
