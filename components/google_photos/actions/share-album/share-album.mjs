import app from "../../google_photos.app.mjs";

export default {
  key: "google_photos-share-album",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Share Album",
  description: "Sets an album shareable. Returns a share token and url. [See the documentation](https://developers.google.com/photos/library/guides/share-media#sharing-album)",
  props: {
    app,
    albumId: {
      propDefinition: [
        app,
        "albumId",
      ],
    },
    isCollaborative: {
      type: "boolean",
      label: "Is Collaborative",
      description: "Sets whether other Google Photos users can add content to the shared album.",
      optional: true,
    },
    isCommentable: {
      type: "boolean",
      label: "Is Commentable",
      description: "Sets whether other Google Photos users can comment on the shared album.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const resp = await this.app.shareAlbum({
      $,
      albumId: this.albumId,
      data: {
        sharedAlbumOptions: {
          isCollaborative: this.isCollaborative,
          isCommentable: this.isCommentable,
        },
      },
    });
    $.export("$summary", "Album has been retrieved.");
    return resp;
  },
};
