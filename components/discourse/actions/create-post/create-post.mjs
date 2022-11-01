import discourse from "../../discourse.app.mjs";

export default {
  name: "Create Post",
  version: "0.0.1",
  key: "discourse-create-post",
  description: "Creates a post. [See docs here](https://openapi.discourse.io/#/Companies/post_companies)",
  type: "action",
  props: {
    discourse,
    title: {
      label: "Title",
      description: "Title of the post",
      type: "string",
    },
    raw: {
      label: "Content",
      description: "Content of the post",
      type: "string",
    },
    topicId: {
      propDefinition: [
        discourse,
        "topicId",
      ],
    },
    categoryid: {
      type: "string",
      description: "Category ID of the post",
      propDefinition: [
        discourse,
        "categories",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.discourse.createPost({
      $,
      data: {
        title: this.title,
        raw: this.raw,
        topic_id: this.topicId,
        category: this.category,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created post with id ${response.id}`);
    }

    return response;
  },
};
