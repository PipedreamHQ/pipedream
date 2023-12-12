import circle from "../../circle.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "circle-create-comment",
  name: "Create Comment",
  description: "Creates a comment on a post in Circle. [See the documentation](https://api.circle.so)",
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
    post_id: {
      propDefinition: [
        circle,
        "post_id",
        (c) => ({
          community_id: c.community_id,
          space_id: c.space_id,
        }),
      ],
    },
    commentData: {
      propDefinition: [
        circle,
        "commentData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.circle.createComment({
      community_id: this.community_id,
      space_id: this.space_id,
      post_id: this.post_id,
      ...this.commentData,
    });

    $.export("$summary", `Successfully created a comment on post ID ${this.post_id}`);
    return response;
  },
};
