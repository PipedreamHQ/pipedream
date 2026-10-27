import { ConfigurationError } from "@pipedream/platform";
import { prepareMediaUpload } from "../../common/utils.mjs";
import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-upload-media",
  name: "Upload Media",
  description: "Uploads a media file from a URL to the specified WordPress.com site. [See the documentation](https://developer.wordpress.com/docs/api/1.1/post/sites/%24site/media/new/)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wordpress,
    site: {
      propDefinition: [
        wordpress,
        "siteId",
      ],
    },
    media: {
      type: "string",
      label: "Media URL",
      description: "A direct HTTPS URL to the media file to upload, e.g. `https://example.com/image.jpg`. The URL must point at the file itself, not at a page containing it.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the media",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Optional caption text to associate with the uploaded media",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the uploaded media",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      wordpress,
      site,
      media,
      ...fields
    } = this;

    let mediaUrl;
    try {
      mediaUrl = new URL(media);
    } catch {
      throw new ConfigurationError(`**Media URL** must be a direct HTTPS URL to the file, e.g. \`https://example.com/image.jpg\`. Received: \`${media}\``);
    }
    if (mediaUrl.protocol !== "https:") {
      throw new ConfigurationError(`**Media URL** must use the \`https\` protocol. Received: \`${media}\``);
    }

    const form = await prepareMediaUpload(media, fields);

    const response = await wordpress.uploadWordpressMedia({
      $,
      contentType: form.getHeaders()["content-type"],
      site,
      data: form,
    });

    $.export("$summary", `Media ID “${response.media[0].ID}” has been successfully uploaded`);

    return response;
  },
};

