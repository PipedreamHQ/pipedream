import { defineAction } from "@pipedream/types";
import vk from "../../app/vk.app";

export default defineAction({
  key: "vk-get-videos",
  name: "Get Videos",
  description: "Returns detailed information about videos. [See the docs here](https://vk.com/dev/video.get)",
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
      await this.vk.getVideos({
        params: {
          offset,
          count,
        },
      });

    $.export("$summary", `Successfully listed ${items.length} videos`);

    return items;
  },
});
