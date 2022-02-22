// legacy_hash_id: a_A6iP3l
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-retrieve-comments-shares",
  name: "Retrieve Comments On Shares",
  description: "Retrieve comments on shares given the share urn.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    entity_urn: {
      type: "string",
      description: "Urn of the entity to retreive likes on.",
    },
    start: {
      type: "integer",
      description: "The index of the first item you want results for.",
      optional: true,
    },
    count: {
      type: "integer",
      description: "The number of items you want included on each page of results. Note that there may be less remaining items than the value you specify here.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-shares

    if (!this.entity_urn) {
      throw new Error("Must provide entity_urn parameter.");
    }

    return await axios($, {
      url: `https://api.linkedin.com/v2/socialActions/${this.entity_urn}/comments`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      params: {
        start: this.start,
        count: this.count,
      },
    });
  },
};
