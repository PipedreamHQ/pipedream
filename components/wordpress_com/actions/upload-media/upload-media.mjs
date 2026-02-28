import { prepareMediaUpload } from "../../common/utils.mjs";
import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-upload-media",
  name: "Upload Media",
  description: "Uploads a media file from a URL to the specified WordPress.com site. [See the documentation](https://developer.wordpress.com/docs/api/1.1/post/sites/%24site/media/new/)",
  version: "0.0.4",
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
      type: "any",
      label: "Media URL",
      description: "A direct media URL, or a FormData object with the file attached under the field name 'media[]'.",
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

    const
      {
        wordpress,
        site,
        media,
        ...fields
      } = this;

    let form;

    // If not form data
    if (wordpress.isFormData(media)) {
      form = media;

    } else {
      form = await prepareMediaUpload(media, fields, $);
    }

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

