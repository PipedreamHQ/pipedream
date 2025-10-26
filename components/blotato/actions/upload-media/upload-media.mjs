import blotato from "../../blotato.app.mjs";

export default {
  key: "blotato-upload-media",
  name: "Upload Media",
  description: "Uploads a media file by providing a URL. The uploaded media will be processed and stored, returning a new media URL that can be used to publish a post. [See documentation](https://help.blotato.com/api/api-reference/upload-media-v2-media)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    blotato,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Media uploads are limited to 200MB file size or smaller.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The publicly accessible URL of the media to upload. For Google Drive files, use the format: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`",
    },
  },
  async run({ $ }) {
    const { url } = this;

    const response = await this.blotato._makeRequest({
      $,
      method: "POST",
      path: "/v2/media",
      data: {
        url,
      },
    });

    $.export("$summary", `Successfully uploaded media. New URL: ${response.url}`);

    return response;
  },
};
