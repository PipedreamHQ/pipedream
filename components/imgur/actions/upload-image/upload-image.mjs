import imgur from "../../imgur.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  name: "Upload Image",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "imgur-upload-image",
  description: "Upload an image to Imgur",
  type: "action",
  props: {
    imgur,
    image: {
      type: "string",
      label: "Image",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFlie.pdf).",
    },
  },
  methods: {
    streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const stream = await getFileStream(this.image);
    const base64 = await this.streamToBase64(stream);

    const res = await this.imgur.uploadImage(base64);

    if (res.status !== 200) {
      $.export("response", res);
      if ($.flow) {
        return $.flow.exit("Failed to upload.");
      } else {
        throw new Error("Failed to upload.");
      }
    }

    return res;
  },
};
