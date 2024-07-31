import fs from "fs";
import FormData from "form-data";
import app from "../../trust.app.mjs";

export default {
  key: "trust-upload-video",
  name: "Upload Video",
  description: "Upload a video to the Trust platform. [See the documentation](https://api-docs.usetrust.io/uploads-a-video-to-be-used-for-testimonials).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    brandId: {
      propDefinition: [
        app,
        "brandId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.mp4`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
    },
  },
  methods: {
    uploadVideo({
      brandId, ...args
    } = {}) {
      return this.app.post({
        path: `/media/upload-video/${brandId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadVideo,
      brandId,
      filePath,
    } = this;

    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const response = await uploadVideo({
      $,
      brandId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", "Successfully uploaded video.");

    return response;
  },
};
