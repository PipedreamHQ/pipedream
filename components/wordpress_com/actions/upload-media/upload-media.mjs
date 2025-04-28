import { prepareMediaUpload } from "../../common/utils.mjs";
import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-upload-media",
  name: "Upload Media",
  description: "Uploads a media file from a URL to the specified WordPress.com site.",
  version: "0.0.1",
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
    const warnings = [];

    const
      {
        wordpress,
        site,
        media,
        ...fields
      } = this;

    warnings.push(...wordpress.checkDomainOrId(site));

    let form;

    // If not form data
    if (wordpress.isFormData(media)) {
      form = media;

    } else {
      form = await prepareMediaUpload(media, fields, $);
    }

    let response;

    try {
      response = await wordpress.uploadWordpressMedia({
        $,
        contentType: form.getHeaders()["content-type"],
        site,
        data: form,
      });

      const media = response.media[0];

      $.export("$summary", `Media "${media.title}" uploaded successfully (ID: ${media.ID})` + "\n- " + warnings.join("\n- "));

      console.log(response);
      return response;

    } catch (error) {
      wordpress.throwCustomError("Failed to upload media", error, warnings);
    };
  },
};

