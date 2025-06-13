import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "api4ai",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image",
      description: "Input image. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFlie.pdf).",
    },
  },
  methods: {
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];

        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
    async makeRequest($, url, image, params = {}) {
      // Prepare form data.
      const form = new FormData();
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(image);

      const buffer = await this.streamToBuffer(stream);
      form.append("image", buffer, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      // Prepare headers.
      const headers = {
        "Content-Type": "multipart/form-data",
        "X-RapidAPI-Key": this.$auth.api_key,
        "A4A-CLIENT-USER-ID": "pipedream.com",
      };

      // Perfrom POST reqest.
      const response = await axios($, {
        url,
        method: "post",
        data: form,
        headers,
        params,
      });

      // Return response.
      return response;
    },
  },
};
