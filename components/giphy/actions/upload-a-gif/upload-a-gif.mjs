import giphyApp from "../../giphy.app.mjs";
import FormData from "form-data";

export default {
  name: "Upload a Gif",
  description: "Uploads a Gif or video file up to 100MB programmatically on GIPHY.com [See the docs here](https://developers.giphy.com/docs/api/endpoint#upload).",
  key: "giphy-upload-gif",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    giphyApp,
    imgUrl: {
      type: "string",
      label: "URL",
      description: "The URL for the image or video you wish to upload.",
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "A comma delimited list of tags to be applied to the upload.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Your assigned username (required for approved apps only).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      imgUrl,
      tags,
      username,
    } = this;

    const formData = new FormData();
    formData.append("source_image_url", imgUrl);
    if (tags) {
      formData.append("tags", tags);
    }
    if (username) {
      formData.append("username", username);
    }

    const res = await this.giphyApp.uploadGif(formData, $);
    $.export("$summary", "Gif successfully uploaded");
    return res;
  },
};
