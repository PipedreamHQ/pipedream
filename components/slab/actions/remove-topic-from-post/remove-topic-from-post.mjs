import slab from "../../slab.app.mjs";
import { REMOVE_TOPIC_FROM_POST_MUTATION } from "../../common/queries.mjs";

export default {
  key: "slab-remove-topic-from-post",
  name: "Remove Topic From Post",
  description: "Disassociate a topic from a post via the `removeTopicFromPost` GraphQL mutation, returning the topic. This only removes the association (reversible with **Add Topic To Post**); it does not delete the post or the topic. Run **Search Posts** for the post ID and **List Topics** for the topic ID before calling. Example: postId `abc123`, topicId `abc12def` returns `{\"id\":\"abc12def\",\"name\":\"Engineering\"}`. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootMutationType#removeTopicFromPost).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    slab,
    postId: {
      propDefinition: [
        slab,
        "postId",
      ],
      description: "ID of the post to remove the topic from. Run **Search Posts** first to obtain the ID.",
    },
    topicId: {
      propDefinition: [
        slab,
        "topicId",
      ],
      description: "ID of the topic to disassociate from the post. Run **List Topics** first to obtain the ID.",
    },
  },
  async run({ $ }) {
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: REMOVE_TOPIC_FROM_POST_MUTATION,
        variables: {
          postId: this.postId,
          topicId: this.topicId,
        },
      },
    });
    const topic = response.removeTopicFromPost;
    $.export("$summary", `Successfully removed topic "${topic.name}" (${topic.id}) from post ${this.postId}`);
    return topic;
  },
};
