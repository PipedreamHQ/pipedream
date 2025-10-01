import discourse from "../../discourse.app.mjs";

export default {
  name: "Create Post",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "discourse-create-post",
  description: "Creates a post. [See docs here](https://docs.discourse.org/#tag/Posts/operation/createTopicPostPM)",
  type: "action",
  props: {
    discourse,
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
  },
  async run({ $ }) {
    // we use the same method to create post and topics
    const response = await this.discourse.createPostOrTopic({
      $,
      data: {
        raw: this.raw,
        topic_id: this.topicId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created post with id ${response.id}`);
    }

    return response;
  },
};
