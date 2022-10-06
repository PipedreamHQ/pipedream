import vk from "../../app/vk.app";

export default {
  key: "vk-get-wall-posts",
  name: "Get Wall Posts",
  description: "Returns a list of posts on a user wall or community wall. [See the docs here](https://vk.com/dev/wall.get)",
  type: "action",
  version: "0.0.6",
  props: {
    vk,
    offset: {
      propDefinition: [
        vk,
        "offset",
      ],
    },
    count: {
      propDefinition: [
        vk,
        "count",
      ],
    },
  },
  async run({ $ }) {
    const {
      offset,
      count,
    } = this;

    const response =
      await this.vk.getWallPosts({
        offset,
        count,
      });

    $.export("$summary", "Successfully listed wall posts");

    return response;
  },
};
