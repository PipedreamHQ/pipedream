// legacy_hash_id: a_YEiwbV
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-share-content",
  name: "Share Content",
  description: "Shares a post with content, which represents external articles and media such as images referenced in a share.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    share_owner: {
      type: "string",
      description: "Owner of the share, in URN format.",
    },
    share_content: {
      type: "object",
      description: "Referenced content such as articles and images. See the Schema of this property in [Share Content](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content).",
      optional: true,
    },
    distribution: {
      type: "object",
      description: "Distribution target for the share. Required to set the share as publicly visible. For sponsored content where the targeting is defined when it is sponsored, distribution should be null. See the Schema of this property in [Share Distribution Target](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-distribution-targets)",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content

    if (!this.share_owner || !this.share_content) {
      throw new Error("Must provide share_owner and share_content parameters.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.linkedin.com/v2/shares",
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      data: {
        content: this.share_content,
        distribution: this.distribution,
        owner: this.share_owner,
      },
    });
  },
};
