// legacy_hash_id: a_bKijbM
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-post-share",
  name: "Post Share",
  description: "Posts a share, text, media, or rather sponsored content, in the context of a specific member or organization.",
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
      description: "Referenced content such as articles and images. See the Schema of this property in [Share Content](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content). Required if text is empty.",
      optional: true,
    },
    agent: {
      type: "string",
      description: "Agent is the Sponsored Ad Account, in URN format, that created the Direct Sponsored Content Share on behalf of an organization. This permission has to be delegated. Only used for [direct sponsored content organization share](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#direct-sponsored-content-share).",
      optional: true,
    },
    distribution: {
      type: "object",
      description: "Distribution target for the share. Required to set the share as publicly visible. For sponsored content where the targeting is defined when it is sponsored, distribution should be null. See the Schema of this property in [Share Distribution Target](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-distribution-targets)",
      optional: true,
    },
    share_subject: {
      type: "string",
      description: "Subject of the share. Required for direct sponsored shares.",
      optional: true,
    },
    reshared_share: {
      type: "string",
      description: "Share being reshared, in URN format. Required when resharing. Not allowed otherwise.",
      optional: true,
    },
    original_share: {
      type: "string",
      description: "The original or root share of what's being reshared, in URN format. Required when resharing. Not allowed otherwise.",
      optional: true,
    },
    share_text: {
      type: "string",
      description: "Text of the share. Required if content is empty.",
      optional: true,
    },
    annotations: {
      type: "any",
      description: "Annotations of the shared text, which are mentions or tags of other Linkedin entities such as organizations or members, see the full schema in [Share Text and Mentions](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-text-and-mentions)",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#post-shares

    if (!this.share_owner) {
      throw new Error("Must provide share_owner parameters.");
    }

    //Prepares the data, payload of the request
    var data = {
      content: this.share_content,
      agent: this.agent,
      distribution: this.distribution,
      owner: this.share_owner,
      subject: this.share_subject,
      resharedShare: this.reshared_share,
      originalShare: this.original_share,
    };

    //Prepares the text component of the request if it's present in the parameters.
    if (this.share_text || this.annotations) {
      var text = new Object();

      if (this.share_text) {
        text["text"] = this.share_text;
      }

      if (this.annotations) {
        text["annotations"] = this.annotations;
      }

      data["text"] = text;
    }

    return await axios($, {
      method: "post",
      url: "https://api.linkedin.com/v2/shares",
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      data,
    });
  },
};
