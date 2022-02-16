// legacy_hash_id: a_G1ierz
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-retrieve-comments-on-comments",
  name: "Retrieves comments on comments",
  description: "Retrieves comments on comments, given the parent comment urn.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    comment_urn: {
      type: "string",
      description: "To resolve nested comments for a given parent comment, provide a parent `commentUrn` as the target in the request URL. A `commentUrn` is a composite URN constructed using a comment ID and `activityUrn`.",
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
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-comments

    if (!this.comment_urn) {
      throw new Error("Must provide comment_urn parameter.");
    }

    return await axios($, {
      url: `https://api.linkedin.com/v2/socialActions/${this.comment_urn}/comments`,
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
