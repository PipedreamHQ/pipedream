import app from "../../google_photos.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_photos-list-library-contents",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "List Library Contents",
  description: "Lists media items in Google Photos. Google's API only returns items created through this app (e.g. uploaded with **Upload Item**), not the rest of the user's library, so an empty result does not mean the library is empty. [See the documentation](https://developers.google.com/photos/library/guides/list#listing-library-contents)",
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
    $.export("$summary", `${items.length} media item${items.length === 1
      ? ""
      : "s"} found.`);
    return items;
  },
};
