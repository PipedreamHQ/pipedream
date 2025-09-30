import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-update-albumimage",
  name: "Update Album Image",
  description: "Updates an album image. [See the docs here](https://api.smugmug.com/api/v2/doc/reference/album-image.html)",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smugmug,
    album: {
      propDefinition: [
        smugmug,
        "album",
      ],
      description: "Album Key of the album containing the image",
    },
    image: {
      propDefinition: [
        smugmug,
        "image",
        (c) => ({
          albumKey: c.album,
        }),
      ],
      description: "Image Key of the image to update.",
    },
    altitude: {
      type: "integer",
      label: "Altitude",
      description: "The altitude this image was taken at.",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "A caption for the image.",
      optional: true,
    },
    hidden: {
      type: "boolean",
      label: "Hidden",
      description: "Is this image hidden?",
      optional: true,
    },
    keywords: {
      type: "string",
      label: "Keywords",
      description: "A semicolon-separated list of keywords.",
      optional: true,
    },
    latitude: {
      type: "integer",
      label: "Latitude",
      description: "The latitude this image was taken at.",
      optional: true,
    },
    longitude: {
      type: "integer",
      label: "Longitute",
      description: "The longitude this image was taken at.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the image.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      Altitude: this.altitude,
      Caption: this.caption,
      Hidden: this.hidden,
      Keywords: this.keywords,
      Latitude: this.latitude,
      Longitude: this.longitude,
      Title: this.title,
    };

    const response = await this.smugmug.updateAlbumimage(this.image, {
      data,
      $,
    });
    if (response) {
      $.export("$summary", "Updated album image");
    }
    return response;
  },
};
