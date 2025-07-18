import linkedin from "../../linkedin.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linkedin-create-text-post-user",
  name: "Create a Simple Post (User)",
  description: "Create post on LinkedIn using text, URL or article. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api?view=li-lms-2022-11&tabs=http#create-organic-posts) for more information",
  version: "0.0.7",
  type: "action",
  props: {
    linkedin,
    visibility: {
      propDefinition: [
        linkedin,
        "visibility",
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
      commentary: utils.escapeText(this.text),
      visibility: this.visibility,
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
    $.export("$summary", "Successfully created a new Post as User");
    return response;
  },
};
