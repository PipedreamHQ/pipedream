import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-create-text-share-organization",
  name: "Create a Simple Post (Organization)",
  description: "Create post on LinkedIn using text, URL or article. [See the docs](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api?tabs=http#create-ugc-posts) for more information",
  version: "0.0.2",
  type: "action",
  props: {
    linkedin,
    organizationId: {
      propDefinition: [
        linkedin,
        "organizationId",
      ],
    },
    type: {
      propDefinition: [
        linkedin,
        "type",
      ],
      reloadProps: true,
    },
    text: {
      propDefinition: [
        linkedin,
        "text",
      ],
    },
  },
  async additionalProps() {
    if (this.type === "ARTICLE") {
      return {
        originalUrl: {
          type: "string",
          label: "Article Url",
          description: "URL whose content is summarized. content may not have a corresponding url for some entities. Maximum length is 8192 characters.",
        },
        thumbnail: {
          type: "string",
          label: "Thumbnail Url",
          description: "The thumbnail saved from the ingestion of this article",
        },
        title: {
          type: "string",
          label: "Title",
          description: "The title of this article",
        },
      };
    } else {
      return {
        text: {
          type: "string",
          label: "Text",
          description: "Text to be posted on LinkedIn timeline",
        },
      };
    }
  },
  async run({ $ }) {
    const response = await this.linkedin.createPost({
      $,
      orgId: this.organizationId,
      type: this.type,
      text: this.text,
      originalUrl: this.originalUrl,
      thumbnail: this.thumbnail,
      title: this.title,
      visibility: "PUBLIC",
    });
    $.export("$summary", "Successfully created a new Post as Organization");
    return response;
  },
};
