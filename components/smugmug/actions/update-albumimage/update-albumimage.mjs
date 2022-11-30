import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-update-albumimage",
  name: "Update AlbumImage",
  description: "Updates an albumimage.In Smugmug, an alubumimage represents the relationship between a particular album and a particular image in that album. [See the docs here](https://api.smugmug.com/api/v2/doc/reference/album-image.html)",
  version: "0.1.1",
  type: "action",
  props: {
    smugmug,
    album_key: {
      type: "string",
    },
    image_key: {
      type: "string",
      description: "Key of the image to update.",
    },
    altitude: {
      type: "integer",
      description: "The altitude this image was taken at.",
      optional: true,
    },
    caption: {
      type: "string",
      description: "A caption for the image.",
      optional: true,
    },
    hidden: {
      type: "boolean",
      description: "Is this image hidden?",
      optional: true,
    },
    keywords: {
      type: "string",
      description: "A semicolon-separated list of keywords.",
      optional: true,
    },
    keywordsarray: {
      type: "any",
      description: "A json array of keywords.",
      optional: true,
    },
    latitude: {
      type: "integer",
      description: "The latitude this image was taken at.",
      optional: true,
    },
    longitude: {
      type: "integer",
      description: "The longitude this image was taken at.",
      optional: true,
    },
    title: {
      type: "string",
      description: "The title of the image.",
      optional: true,
    },
  },
  async run() {
  //See the API docs here: https://api.smugmug.com/api/v2/doc/reference/album-image.html

    /*   const config = {
      method: "patch",
      url: `https://www.smugmug.com/api/v2/album/${this.album_key}/image/${this.image_key}`,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      data: {
        Altitude: this.altitude,
        Caption: this.caption,
        Hidden: this.hidden,
        Keywords: this.keywords,
        KeywordArray: this.keywordsarray,
        Latitude: this.latitude,
        Longitude: this.longitude,
        Title: this.title,
      },
    };

    const signature = {
      token: {
        key: this.smugmug.$auth.oauth_access_token,
        secret: this.smugmug.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.smugmug.$auth.oauth_signer_uri,
    };

    return await axios($, config, signature); */
  },
};
