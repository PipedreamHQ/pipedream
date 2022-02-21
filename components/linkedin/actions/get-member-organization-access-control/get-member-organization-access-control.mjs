// legacy_hash_id: a_NqiqxJ
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-get-member-organization-access-control",
  name: "Get Member's Organization Access Control Information",
  description: "Gets the organization access control information of the current authenticated member.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    role: {
      type: "string",
      description: "Limit results to specific roles, such as ADMINISTRATOR or DIRECT_SPONSORED_CONTENT_POSTER.",
      optional: true,
    },
    state: {
      type: "string",
      description: "Limit results to specific role states, such as APPROVED or REQUESTED.",
      optional: true,
    },
    start: {
      type: "integer",
      description: "The index of the first item you want results for.",
      optional: true,
    },
    count: {
      type: "integer",
      description: "The number of items you want included on each page of results.  Note that there may be less remaining items than the value you specify here.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control?context=linkedin/compliance/context#find-a-members-organization-access-control-information

    return await axios($, {
      url: "https://api.linkedin.com/v2/organizationAcls",
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      params: {
        q: "roleAssignee",
        role: this.role,
        state: this.state,
        start: this.start,
        count: this.count,
      },
    });
  },
};
