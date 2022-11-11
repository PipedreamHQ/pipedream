import { defineAction } from "@pipedream/types";
import vk from "../../app/vk.app";

export default defineAction({
  key: "vk-get-wall-posts",
  name: "Get Wall Posts",
  description: "Returns a list of posts on a user wall or community wall. [See the docs here](https://vk.com/dev/wall.get)",
  type: "action",
  version: "0.0.1",
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

    const { response: { items = [] } = {} } =
      await this.vk.getWallPosts({
        params: {
          offset,
          count,
        },
      });

    $.export("$summary", `Successfully listed ${items.length} wall posts`);

    return items;
  },
});
