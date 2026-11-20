import app from "../../google_photos.app.mjs";

export default {
  key: "google_photos-add-items-to-album",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Add Items To Album",
  description: "Adds selected items to the selected album. Only items and albums created through this app are available; the user's existing library items and albums cannot be selected. [See the documentation](https://developers.google.com/photos/library/guides/manage-albums#adding-items-to-album)",
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
