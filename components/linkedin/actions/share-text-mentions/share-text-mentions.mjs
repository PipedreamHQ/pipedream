// legacy_hash_id: a_eli7xN
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-share-text-mentions",
  name: "Share Text And Mentions",
  description: "Shares a posts with text and mentions only.",
  version: "0.3.1",
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
    share_text: {
      type: "string",
      description: "Text of the share.",
    },
    annotations: {
      type: "any",
      description: "Annotations of the shared text, which are mentions or tags of other Linkedin entities such as organizations or members, see the full schema in [Share Text and Mentions](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-text-and-mentions)",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-text-and-mentions

    if (!this.share_owner || !this.share_text) {
      throw new Error("Must provide share_owner and share_text parameters.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.linkedin.com/v2/shares",
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      data: {
        text: {
          text: this.share_text,
          annotations: this.annotations,
        },
        distribution: {
          "linkedInDistributionTarget": {},
        },
        owner: this.share_owner,
      },
    });
  },
};
