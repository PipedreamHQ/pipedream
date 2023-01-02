import twitter from "../../twitter.app.mjs";
import fs from "fs";
import mime from "mime";

export default {
  key: "twitter-upload-media",
  name: "Upload Media",
  description: "Upload images or other media types to Twitter. Returns a `media_id_string` to be used with the Create Tweet action. [See the docs here](https://developer.twitter.com/en/docs/tutorials/uploading-media)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    // INIT
    const fileContent = fs.readFileSync(this.file, {
      encoding: "base64",
    });
    const fileSize = (fs.statSync(this.file)).size;
    const { media_id_string: mediaId } = await this.twitter.uploadMedia({
      params: {
        command: "INIT",
        total_bytes: fileSize,
        media_type: this.mediaType,
        additional_owners: this.twitter.$auth.oauth_uid,
      },
      $,
    });

    // APPEND
    const size = 5012;
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
    const response = await this.twitter.uploadMedia({
      params: {
        command: "FINALIZE",
        media_id: mediaId,
      },
      $,
    });
    response && $.export("$summary", `Successfully uploaded media with Media ID ${mediaId}`);
    return response;
  },
};
