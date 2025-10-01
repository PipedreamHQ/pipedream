import app from "../../google_photos.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_photos-list-library-contents",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "List Library Contents",
  description: "Retrieves library contents [See the documentation](https://developers.google.com/photos/library/guides/list#listing-library-contents)",
  props: {
    app,
  },
  async run ({ $ }) {
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.listMediaItems,
      resourceKey: "mediaItems",
      resourceFnArgs: {
        $,
      },
    });
    const items = [];
    for await (const item of resourcesStream) {
      items.push(item);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} album${items.length == 1 ? "" : "s"} found.`);
    return items;
  },
};
