import discourse from "../../discourse.app.mjs";

export default {
  name: "Create Topic",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "discourse-create-topic",
  description: "Creates a topic. [See docs here](https://docs.discourse.org/#tag/Topics/operation/createTopicPostPM)",
  type: "action",
  props: {
    discourse,
    title: {
      label: "Title",
      description: "Title of the topic",
      type: "string",
    },
    raw: {
      label: "Content",
      description: "Content of the topic",
      type: "string",
    },
    categoryid: {
      type: "string",
      description: "Category ID for the topic",
      propDefinition: [
        discourse,
        "categories",
      ],
    },
  },
  async run({ $ }) {
    // we use the same method to create post and topics
    const response = await this.discourse.createPostOrTopic({
      $,
      data: {
        title: this.title,
        raw: this.raw,
        category: this.categoryid,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created topic with id ${response.id}`);
    }

    return response;
  },
};
