import app from "../../imgbb.app.mjs";
import { stringify } from "qs";
import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";

export default {
  key: "imgbb-upload-picture",
  name: "Upload picture",
  description: "Upload a picture to imgbb. [See the docs here](https://api.imgbb.com/)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide a file URL or a path to a file in the `/tmp` directory.",
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of the file, this is automatically detected if uploading a file with a POST and multipart / form-data",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
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
    const {
      file, name,
    } = this;
    if (!file) {
      throw new ConfigurationError("The `File Path or URL` prop is required.");
    }

    let image;
    if (file.startsWith("http")) {
      image = file;
    } else {
      const stream = await getFileStream(file);
      image = await this.streamToBase64(stream);
    }

    const data = {
      image,
      name,
    };
    const res = await this.app.uploadPicture($, stringify(data));
    $.export("$summary", "Successfully uploaded picture");
    return res;
  },
};
