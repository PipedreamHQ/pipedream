import nyckel from "../nyckel.app.mjs";
import FormData from "form-data";
import fs from "fs";

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
    getImageData() {
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
      data.append("data", fs.createReadStream(
        imageOrUrl.includes("tmp/")
          ? imageOrUrl
          : `/tmp/${imageOrUrl}`,
      ));

      return {
        data,
        headers: data.getHeaders(),
      };
    },
  },
};
