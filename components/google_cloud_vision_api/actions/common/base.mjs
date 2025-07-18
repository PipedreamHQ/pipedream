import googleCloudVision from "../../google_cloud_vision_api.app.mjs";
import {
  ConfigurationError,
  getFileStream,
} from "@pipedream/platform";

export default {
  props: {
    googleCloudVision,
    projectId: {
      propDefinition: [
        googleCloudVision,
        "projectId",
      ],
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide a file URL or a path to a file in the `/tmp` directory.",
    },
  },
  methods: {
    checkFileProp() {
      if (!this.file) {
        throw new ConfigurationError("The File field is required.");
      }
    },
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
    async getFileContent() {
      const stream = await getFileStream(this.file);
      return this.streamToBase64(stream);
    },
  },
};

