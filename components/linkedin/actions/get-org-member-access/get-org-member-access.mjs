import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-org-member-access",
  name: "Get Member's Organization Access Control Information",
  description: "Gets the organization access control information of the current authenticated member. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control-by-role?view=li-lms-2025-01&tabs=http#find-a-members-organization-access-control-information)",
  version: "1.0.5",
  type: "action",
  props: {
    linkedin,
    role: {
      propDefinition: [
        linkedin,
        "role",
      ],
    },
    state: {
      propDefinition: [
        linkedin,
        "state",
      ],
    },
    max: {
      propDefinition: [
        linkedin,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      q: "roleAssignee",
      role: this.role,
      state: this.state,
      start: 0,
      count: 1,
    };

    const { data: { elements } } = await this.linkedin.getAccessControl({
      $,
      params,
    });

    $.export("$summary", "Successfully retrieved access control information");

    return elements[0];
  },
};
