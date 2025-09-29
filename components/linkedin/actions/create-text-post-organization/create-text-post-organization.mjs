import linkedin from "../../linkedin.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linkedin-create-text-post-organization",
  name: "Create a Simple Post (Organization)",
  description: "Create post on LinkedIn using text, URL or article. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api?view=li-lms-2022-11&tabs=http#create-organic-posts) for more information",
  version: "0.0.10",
  type: "action",
  props: {
    linkedin,
    organizationId: {
      propDefinition: [
        linkedin,
        "organizationId",
      ],
    },
    text: {
      propDefinition: [
        linkedin,
        "text",
      ],
    },
    article: {
      type: "string",
      label: "Article URL",
      description: "The URL of an article to share",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      author: `urn:li:organization:${this.organizationId}`,
      commentary: utils.escapeText(this.text),
      visibility: "PUBLIC",
      lifecycleState: "PUBLISHED",
      distribution: {
        feedDistribution: "MAIN_FEED",
      },
    };
    if (this.article) {
      data.content = {
        article: {
          source: this.article,
          title: this.article,
        },
      };
    }
    const response = await this.linkedin.createPost({
      $,
      data,
    });
    $.export("$summary", "Successfully created a new Post as Organization");
    return response || {
      success: true,
    };
  },
};
