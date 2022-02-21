// legacy_hash_id: a_OOi6vA
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-get-organization-access-control",
  name: "Gets Organization Access Control",
  description: "Gets an organization's access control information, given the organization urn.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    organization_urn: {
      type: "string",
      description: "The organizational entity for which the access control information is being retrieved. Must be in URN format urn:li:organization:{id}.",
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
  // See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-access-control?context=linkedin/compliance/context#find-access-control-information

    if (!this.organization_urn) {
      throw new Error("Must provide organization_urn parameter.");
    }

    return await axios($, {
      url: "https://api.linkedin.com/v2/organizationAcls",
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      params: {
        q: "organization",
        organization: encodeURI(this.organization_urn),
        start: this.start,
        count: this.count,
      },
    });
  },
};
