import common from "../common.mjs";

export default {
  ...common,
  key: "ilovepdf-compress-pdf-file",
  name: "Compress PDF File",
  description: "Compress one or more PDF files. [See the documentation](https://developer.ilovepdf.com/docs/api-reference)",
  version: "0.0.1",
  type: "action",
  methods: {
    getTool() {
      return "compress";
    },
  },
};
