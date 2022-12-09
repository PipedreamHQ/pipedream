import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-member-organization-access-control",
  name: "Get Member's Organization Access Control Information",
  description: "Gets the organization access control information of the current authenticated member. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control?context=linkedin/compliance/context#find-a-members-organization-access-control-information)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    role: {
      type: "string",
      label: "Role",
      description: "Limit results to specific roles, such as ADMINISTRATOR or DIRECT_SPONSORED_CONTENT_POSTER.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Limit results to specific role states, such as APPROVED or REQUESTED.",
      optional: true,
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
      q: "roleAssignee",
      role: this.role,
      state: this.state,
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
