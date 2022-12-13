import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-create-text-post-user",
  name: "Create a Simple Post (User)",
  description: "Create post on LinkedIn using text, URL or article. [See the docs](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api?view=li-lms-2022-11&tabs=http#create-organic-posts) for more information",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const data = {
      commentary: this.text,
      visibility: this.visibility,
    };
    const response = await this.linkedin.createPost({
      $,
      data,
    });
    $.export("$summary", "Successfully created a new Post as User");
    return response;
  },
};
