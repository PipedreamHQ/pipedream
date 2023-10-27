import common from "../common.mjs";

export default {
  ...common,
  key: "ilovepdf-merge-pdf-files",
  name: "Merge PDF Files",
  description: "Merge multiple PDF files into one unified document. [See the documentation](https://developer.ilovepdf.com/docs/api-reference#introduction)",
  version: "0.0.1",
  type: "action",
  methods: {
    getTool() {
      return "merge";
    },
  },
};
