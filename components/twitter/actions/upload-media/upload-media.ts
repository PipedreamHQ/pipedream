import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import constants from "../../common/constants";
import fs from "fs";
import { axios } from "@pipedream/platform";
import FormData from "form-data";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-upload";

export default defineAction({
  key: "twitter-upload-media",
  name: "Upload Media",
  description: `Upload new media. [See the documentation](${DOCS_LINK})`,
  version: "0.0.7",
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path",
      description: "A file URL or a file path in the `/tmp` directory. [See the documentation on working with files.](https://pipedream.com/docs/code/nodejs/working-with-files/)",
      optional: false,
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
    try {
      const isLocalFile = this.filePath?.startsWith("/tmp");

      const content = isLocalFile
        ? fs.createReadStream(this.filePath, {
          encoding: "base64",
        })
        : await axios($, {
          url: this.filePath,
          responseType: "arraybuffer",
        });

      const data = new FormData();

      if (isLocalFile) {
        data.append("media_data", content);
      } else {
        data.append("media", content);
      }

      const response = await this.app.uploadMedia({
        $,
        data,
        params: {
          media_category: this.media_category,
        },
      });

      $.export("$summary", `Successfully uploaded media with ID ${response.media_id}`);

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
