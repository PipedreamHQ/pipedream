import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-share-content",
  name: "Share Content",
  description: "Shares a post with content, which represents external articles and media such as images referenced in a share. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content)",
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
      description: "Referenced content such as articles and images. See the Schema of this property in [Share Content](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content).",
      optional: true,
    },
    distribution: {
      type: "object",
      label: "Distribution",
      description: "Distribution target for the share. Required to set the share as publicly visible. For sponsored content where the targeting is defined when it is sponsored, distribution should be null. See the Schema of this property in [Share Distribution Target](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-distribution-targets)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      content: this.shareContent,
      distribution: this.distribution,
      owner: this.shareOwner,
    };

    const response = await this.linkedin.createShare({
      $,
      data,
    });

    $.export("$summary", "Successfully shared content");

    return response;
  },
};
