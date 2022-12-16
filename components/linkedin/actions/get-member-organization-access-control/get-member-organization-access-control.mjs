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
    const count = 50;
    const results = [];

    const params = {
      q: "roleAssignee",
      role: this.role,
      state: this.state,
      start: 0,
      count,
    };

    let done = false;
    do {
      const { elements } = await this.linkedin.getAccessControl({
        $,
        params,
      });
      results.push(...elements);
      params.start += count;
      if (elements?.length < count) {
        done = true;
      }
    } while (results.length < this.max && !done);

    $.export("$summary", "Successfully retrieved access control information");

    return results;
  },
};
