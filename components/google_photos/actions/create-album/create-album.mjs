import app from "../../google_photos.app.mjs";

export default {
  key: "google_photos-create-album",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Album",
  description: "Creates an album. [See the documentation](https://developers.google.com/photos/library/guides/manage-albums#creating-new-album)",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "Album title",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.createAlbum({
      $,
      albumId: this.albumId,
      data: {
        album: {
          title: this.title,
        },
      },
    });
    $.export("$summary", `Album(ID:${resp.id}) has been created successfully.`);
    return resp;
  },
};
