import nyckel from "../../nyckel.app.mjs";
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
      const { fileOrUrl } = this;
      const isUrl = fileOrUrl.startsWith("http");
      if (isUrl) {
        return {
          data: {
            data: fileOrUrl,
          },
          headers: {
            "Content-Type": "application/json",
          },
        };
      }

      const data = new FormData();
      data.append("data", fs.createReadStream(
        fileOrUrl.includes("tmp/")
          ? fileOrUrl
          : `/tmp/${fileOrUrl}`,
      ));

      return {
        data,
        headers: data.getHeaders(),
      };
    },
  },
};
