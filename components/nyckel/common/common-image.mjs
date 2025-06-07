import nyckel from "../nyckel.app.mjs";
import FormData from "form-data";
import { getFileStream } from "@pipedream/platform";

export default {
  props: {
    imageOrUrl: {
      propDefinition: [
        nyckel,
        "imageOrUrl",
      ],
    },
  },
  methods: {
    async getImageData() {
      const { imageOrUrl } = this;
      const isUrl = imageOrUrl.startsWith("http");
      if (isUrl) {
        return {
          data: {
            data: imageOrUrl,
          },
          headers: {
            "Content-Type": "application/json",
          },
        };
      }

      const data = new FormData();
      const stream = await getFileStream(imageOrUrl);
      data.append("data", stream);

      return {
        data,
        headers: data.getHeaders(),
      };
    },
  },
};
