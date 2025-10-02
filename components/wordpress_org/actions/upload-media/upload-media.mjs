import wordpress from "../../wordpress_org.app.mjs";
import utils from "../../common/utils.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "wordpress_org-upload-media",
  name: "Upload Media",
  description: "Upload a media item to your WordPress media library. Returns a media ID to be used in creating or updating posts.[See the documentation](https://www.npmjs.com/package/wpapi#uploading-media)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wordpress,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    title: {
      propDefinition: [
        wordpress,
        "title",
      ],
      description: "Title of the media item",
      optional: true,
    },
    altText: {
      type: "string",
      label: "Alt Text",
      description: "Alternative text to display when media is not displayed",
      optional: true,
    },
    description: {
      propDefinition: [
        wordpress,
        "description",
      ],
      description: "Description of the media item",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const content = await getFileStream(this.filePath);

    const params = utils.cleanObj({
      title: this.title,
      alt_text: this.altText,
      description: this.description,
    });
    const response = await this.wordpress.createMedia(content, params);

    $.export("$summary", "Successfully uploaded media.");

    return response;
  },
};
