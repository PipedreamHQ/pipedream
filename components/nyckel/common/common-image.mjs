import nyckel from "../nyckel.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

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
      const data = new FormData();
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.imageOrUrl);
      data.append("data", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      return {
        data,
        headers: data.getHeaders(),
      };
    },
  },
};
