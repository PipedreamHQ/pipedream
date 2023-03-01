import twitter from "../../twitter.app.mjs";
import fs from "fs";
import mime from "mime";
import FormData from "form-data";

// V2 API replacement: "coming soon" https://developer.twitter.com/en/docs/twitter-api/migrate/twitter-api-endpoint-map

export default {
  key: "twitter-upload-media",
  name: "Upload Media",
  description: "Upload images or other media types to Twitter. Returns a `media_id_string` to be used with the Create Tweet action. [See the docs here](https://developer.twitter.com/en/docs/tutorials/uploading-media)",
  version: "0.0.3",
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
  methods: {
    async append($, fileSize, mediaId) {
      const bufferLength = 1000000;
      const theBuffer = new Buffer(bufferLength);
      let offset = 0;
      let segment = 0;
      const fd = fs.openSync(this.file, "r");
      while (offset < fileSize) {
        const bytesRead = fs.readSync(fd, theBuffer, 0, bufferLength, null);
        const mediaData = bytesRead < bufferLength
          ? theBuffer.slice(0, bytesRead)
          : theBuffer;
        const data = new FormData();
        data.append("command", "APPEND");
        data.append("media_id", mediaId);
        data.append("media_data", mediaData.toString("base64"));
        data.append("segment_index", segment);
        await this.twitter.uploadMedia({
          data,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
          $,
        });
        segment++;
        offset += bufferLength;
      }
      fs.close(fd);
    },
  },
  async run({ $ }) {
    // INIT
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
    await this.append($, fileSize, mediaId);

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
