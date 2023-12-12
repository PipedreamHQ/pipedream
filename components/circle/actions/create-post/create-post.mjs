import circle from "../../circle.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "circle-create-post",
  name: "Create Post",
  description: "Create a new post in a selected space within your Circle community. [See the documentation](https://api.circle.so)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    circle,
    community_id: {
      propDefinition: [
        circle,
        "community_id",
        {
          async options() {
            const communities = await this.circle.listCommunities();
            return communities.map((community) => ({
              label: community.name,
              value: community.id,
            }));
          },
        },
      ],
    },
    space_id: {
      propDefinition: [
        circle,
        "space_id",
        (c) => ({
          community_id: c.community_id,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the post",
    },
  },
  async run({ $ }) {
    if (!this.community_id || !this.space_id || !this.title || !this.content) {
      throw new Error("Community ID, Space ID, Title, and Content are required.");
    }

    const postData = {
      title: this.title,
      content: this.content,
    };

    const response = await this.circle.createPost({
      community_id: this.community_id,
      space_id: this.space_id,
      ...postData,
    });

    $.export("$summary", `Successfully created post with title "${this.title}"`);
    return response;
  },
};
