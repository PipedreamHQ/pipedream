import { defineAction } from "@pipedream/types";
import vk from "../../app/vk.app";

export default defineAction({
  key: "vk-get-wall-post",
  name: "Get Wall Post",
  description: "Returns a post from user or community walls by ID. [See the docs here](https://vk.com/dev/wall.getById)",
  type: "action",
  version: "0.0.1",
  props: {
    vk,
    postId: {
      propDefinition: [
        vk,
        "postId",
      ],
    },
  },
  async run({ $ }) {
    const { postId } = this;

    const { response = [] } = await this.vk.getUsers();
    const { id: userId } = response[0] || {};

    const {
      response: [
        post,
      ],
    } =
      await this.vk.getWallPost({
        params: {
          posts: `${userId}_${postId}`,
        },
      });

    if (post) {
      $.export("$summary", `Successfully got a wall post with ID ${post.id}`);
    } else {
      $.export("$summary", "Wall post was not found");
    }

    return post;
  },
});
