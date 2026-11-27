import app from "../../google_photos.app.mjs";

export default {
  key: "google_photos-get-media-item",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Get Media Item",
  description: "Retrieves a media item by ID. Only works for items created through this app; other items in the user's library are not accessible. [See the documentation](https://developers.google.com/photos/library/guides/access-media-items)",
  props: {
    app,
    itemId: {
      propDefinition: [
        app,
        "mediaItemId",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.getMediaItem({
      $,
      itemId: this.itemId,
    });
    $.export("$summary", `Media Item - ${resp.filename} has been retrieved.`);
    return resp;
  },
};
