import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import constants from "../../common/constants";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-upload";

export default defineAction({
  ...common,
  key: "twitter-upload-media",
  name: "Upload Media",
  description: `Upload new media. [See the documentation](${DOCS_LINK})`,
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    media_category: {
      type: "string",
      label: "Media Category",
      description: "The category representing the media usage.",
      options: constants.MEDIA_CATEGORIES,
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    let content, meta;

    try {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      content = stream;
      meta = metadata;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }

    const data = new FormData();
    data.append("media_data", content, {
      contentType: meta.contentType,
      knownLength: meta.size,
      filename: meta.name,
    });

    const response = await this.app.uploadMedia({
      $,
      data,
      params: {
        media_category: this.media_category,
      },
      fallbackError: ACTION_ERROR_MESSAGE,
    });

    $.export("$summary", `Successfully uploaded media with ID ${response.media_id}`);

    return response;
  },
});
