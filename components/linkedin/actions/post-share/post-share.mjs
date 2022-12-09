import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-post-share",
  name: "Post Share",
  description: "Posts a share, text, media, or rather sponsored content, in the context of a specific member or organization. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#post-shares)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    shareOwner: {
      type: "string",
      label: "Share Owner",
      description: "Owner of the share, in URN format.",
    },
    shareContent: {
      type: "object",
      label: "Share Content",
      description: "Referenced content such as articles and images. See the Schema of this property in [Share Content](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content). Required if text is empty.",
      optional: true,
    },
    agent: {
      type: "string",
      label: "Agent",
      description: "Agent is the Sponsored Ad Account, in URN format, that created the Direct Sponsored Content Share on behalf of an organization. This permission has to be delegated. Only used for [direct sponsored content organization share](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#direct-sponsored-content-share).",
      optional: true,
    },
    distribution: {
      type: "object",
      label: "Distribution",
      description: "Distribution target for the share. Required to set the share as publicly visible. For sponsored content where the targeting is defined when it is sponsored, distribution should be null. See the Schema of this property in [Share Distribution Target](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-distribution-targets)",
      optional: true,
    },
    shareSubject: {
      type: "string",
      label: "Share Subject",
      description: "Subject of the share. Required for direct sponsored shares.",
      optional: true,
    },
    resharedShare: {
      type: "string",
      label: "Reshared Share",
      description: "Share being reshared, in URN format. Required when resharing. Not allowed otherwise.",
      optional: true,
    },
    originalShare: {
      type: "string",
      label: "Original Share",
      description: "The original or root share of what's being reshared, in URN format. Required when resharing. Not allowed otherwise.",
      optional: true,
    },
    shareText: {
      type: "string",
      label: "Share Text",
      description: "Text of the share. Required if content is empty.",
      optional: true,
    },
    annotations: {
      type: "any",
      label: "Annotations",
      description: "Annotations of the shared text, which are mentions or tags of other Linkedin entities such as organizations or members, see the full schema in [Share Text and Mentions](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-text-and-mentions)",
      optional: true,
    },
  },
  async run({ $ }) {
    var data = {
      content: this.shareContent,
      agent: this.agent,
      distribution: this.distribution,
      owner: this.shareOwner,
      subject: this.share_subject,
      resharedShare: this.resharedShare,
      originalShare: this.originalShare,
    };

    //Prepares the text component of the request if it's present in the parameters.
    if (this.shareText || this.annotations) {
      let text = new Object();

      if (this.shareText) {
        text["text"] = this.shareText;
      }

      if (this.annotations) {
        text["annotations"] = this.annotations;
      }

      data["text"] = text;
    }

    const response = await this.linkedin.createShare({
      $,
      data,
    });

    $.export("$summary", "Successfully posted message");

    return response;
  },
};
