import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-post-share",
  name: "Post Share",
  description: "Posts a share, text, media, or rather sponsored content, in the context of a specific member or organization. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#post-shares)",
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
    shareContent: {
      type: "object",
      label: "Share Content",
      description: "Referenced content such as articles and images. See the Schema of this property in [Share Content](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-content).",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      author: this.organizationId,
      commentary: this.text,
      visibility: this.visibility,
      content: this.shareContent,
    };

    const response = await this.linkedin.createPost({
      $,
      data,
    });

    $.export("$summary", "Successfully posted message");

    return response;
  },
};
