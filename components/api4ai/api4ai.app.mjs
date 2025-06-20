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
      description: "Input image. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
  },
  methods: {
    async makeRequest($, url, image, params = {}) {
      // Prepare form data.
      const form = new FormData();
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(image);

      form.append("image", stream, {
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
