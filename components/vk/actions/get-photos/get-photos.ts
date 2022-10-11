import { defineAction } from "@pipedream/types";
import vk from "../../app/vk.app";

export default defineAction({
  key: "vk-get-photos",
  name: "Get Photos",
  description: "Returns a list of a users or community photos. [See the docs here](https://vk.com/dev/photos.get)",
  type: "action",
  version: "0.0.3",
  props: {
    vk,
    albumId: {
      type: "string",
      label: "Album ID",
      description: "Photo album ID. To return information about photos from service albums, use the following string values: `profile`, `wall`, `saved`.",
      options: [
        "profile",
        "wall",
        "saved",
      ],
    },
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
      albumId,
      offset,
      count,
    } = this;

    const { response: { items = [] } = {} } =
      await this.vk.getPhotos({
        params: {
          album_id: albumId,
          offset,
          count,
        },
      });

    $.export("$summary", `Successfully listed ${items.length} photos`);

    return items;
  },
});
