import twitter from "../../twitter.app.mjs";
import fs from "fs";
import mime from "mime";

export default {
  key: "twitter-upload-media",
  name: "Upload Media",
  description: "Upload images or other media types to Twitter. Returns a `media_id_string` to be used with the Create Tweet action. [See the docs here](https://developer.twitter.com/en/docs/tutorials/uploading-media)",
  version: "0.0.2",
  type: "action",
  props: {
    twitter,
    file: {
      type: "string",
      label: "File",
      description: "The file to upload to Twitter, please provide a file from `/tmp`. To upload a file to `/tmp` folder, please follow the doc [here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "The MIME type of the media being uploaded",
      options() {
        return Object.values(mime._types);
      },
    },
    mediaCategory: {
      type: "string",
      label: "Media Category",
      description: "The category that represents how the media will be used",
      options: [
        "amplify_video",
        "tweet_gif",
        "tweet_image",
        "tweet_video",
      ],
    },
  },
  async run({ $ }) {
    // INIT
    const fileContent = fs.readFileSync(this.file, {
      encoding: "base64",
    });
    const fileSize = (fs.statSync(this.file)).size;
    const params = {
      command: "INIT",
      total_bytes: fileSize,
      media_type: this.mediaType,
      additional_owners: this.twitter.$auth.oauth_uid,
    };
    if (this.mediaCategory) {
      params.media_category = this.mediaCategory;
    }
    const { media_id_string: mediaId } = await this.twitter.uploadMedia({
      params,
      $,
    });

    // APPEND
    const size = 9000;
    const numSegments = fileContent.length / size;
    let segment = 0;
    let startIndex = 0;
    let endIndex = startIndex + size;
    while (segment <= numSegments) {
      const chunk = fileContent.substring(startIndex, endIndex);
      const params = {
        command: "APPEND",
        media_id: mediaId,
        media_data: chunk,
        segment_index: segment,
      };
      await this.twitter.uploadMedia({
        params,
        $,
      });
      segment++;
      startIndex += size;
      endIndex += size;
    }

    // FINALIZE
    let response;
    response = await this.twitter.uploadMedia({
      params: {
        command: "FINALIZE",
        media_id: mediaId,
      },
      $,
    });

    // STATUS
    while (this.mediaCategory?.includes("video")) {
      response = await this.twitter.uploadMedia({
        params: {
          command: "STATUS",
          media_id: mediaId,
        },
        method: "GET",
        $,
      });
      const { processing_info: info } = response;
      if (info?.error) {
        throw new Error(JSON.stringify(info.error));
      }
      if (info?.state === "succeeded") {
        break;
      }
      setTimeout(() => {}, info.check_after_secs * 1000);
    }

    response && $.export("$summary", `Successfully uploaded media with Media ID ${mediaId}`);
    return response;
  },
};
