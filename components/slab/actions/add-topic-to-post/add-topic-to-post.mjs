import slab from "../../slab.app.mjs";
import { ADD_TOPIC_TO_POST_MUTATION } from "../../common/queries.mjs";

export default {
  key: "slab-add-topic-to-post",
  name: "Add Topic To Post",
  description: "Associate a topic with a post via the `addTopicToPost` GraphQL mutation, returning the topic. Run **Search Posts** to obtain the post ID and **List Topics** to obtain the topic ID before calling. Example: postId `abc123`, topicId `abc12def` returns `{\"id\":\"abc12def\",\"name\":\"Engineering\"}`. [See the documentation](https://studio.apollographql.com/public/Slab/variant/current/schema/reference/objects/RootMutationType#addTopicToPost).",
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
      description: "ID of the post to add the topic to. Run **Search Posts** first to obtain the ID.",
    },
    topicId: {
      propDefinition: [
        slab,
        "topicId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slab._makeRequest({
      $,
      data: {
        query: ADD_TOPIC_TO_POST_MUTATION,
        variables: {
          postId: this.postId,
          topicId: this.topicId,
        },
      },
    });
    const topic = response.addTopicToPost;
    $.export("$summary", `Successfully added topic "${topic.name}" (${topic.id}) to post ${this.postId}`);
    return topic;
  },
};
