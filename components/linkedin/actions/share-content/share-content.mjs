import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-share-content",
  name: "Share Content",
  description: "Shares a post with content, which represents external articles and media such as images referenced in a share. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#post-shares)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    organizationId: {
      propDefinition: [
        linkedin,
        "organizationId",
      ],
      optional: true,
    },
    shareContent: {
      type: "object",
      label: "Share Content",
      description: "Referenced content such as articles and images. See the Schema of this property in [Share Content](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content).",
    },
    distribution: {
      type: "object",
      label: "Distribution",
      description: "Distribution target for the share. Required to set the share as publicly visible. For sponsored content where the targeting is defined when it is sponsored, distribution should be null. See the Schema of this property in [Share Distribution Target](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-distribution-targets)",
      optional: true,
    },
    text: {
      type: "string",
      label: "Share Text",
      description: "Text of the share.",
    },
    visibility: {
      propDefinition: [
        linkedin,
        "visibility",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      author: this.organizationId,
      content: this.shareContent,
      distribution: this.distribution,
      commentary: this.text,
      visibility: this.visibility,
    };

    const response = await this.linkedin.createPost({
      $,
      data,
    });

    $.export("$summary", "Successfully shared content");

    return response;
  },
};
