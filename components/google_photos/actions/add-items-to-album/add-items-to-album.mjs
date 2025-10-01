import app from "../../google_photos.app.mjs";

export default {
  key: "google_photos-add-items-to-album",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Add Items To Album",
  description: "Adds selected items to the selected album. [See the documentation](https://developers.google.com/photos/library/guides/manage-albums#adding-items-to-album)",
  props: {
    app,
    albumId: {
      propDefinition: [
        app,
        "albumId",
      ],
    },
    mediaItemIds: {
      propDefinition: [
        app,
        "mediaItemId",
      ],
      type: "string[]",
      label: "Media Item IDs",
      description: "Media Item IDs",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.addItemsToAlbum({
      $,
      albumId: this.albumId,
      data: {
        mediaItemIds: this.mediaItemIds,
      },
    });
    $.export("$summary", "Items has been added to the album successfully.");
    return resp;
  },
};
