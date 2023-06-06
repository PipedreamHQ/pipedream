import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import constants from "../../common/constants";
import fs from "fs";
import { axios } from "@pipedream/platform";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-upload";

export default defineAction({
  key: "twitter-upload-media",
  name: "Upload Media",
  description: `Upload new media. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The file path to upload.",
      optional: false,
    },
    media_category: {
      type: "string",
      label: "Media Category",
      description: "The category representing how the media will be used.",
      options: constants.MEDIA_CATEGORIES,
      optional: false,
    },
  },
  async run({ $ }): Promise<object> {
    try {
      const base64File = this.filePath.startsWith("/tmp")
        ? fs.readFileSync(this.filePath, "base64")
        : Buffer.from(await axios($, {
          url: this.filePath,
          responseType: "arraybuffer",
        })).toString("base64");

      const response = await this.app.uploadMedia({
        $,
        params: encodeURIComponent(JSON.stringify({
          media_category: this.media_category,
          media_data: base64File,
        })),
      });

      $.export("$summary", `Successfully uploaded media with ID ${response.media_id}`);

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
