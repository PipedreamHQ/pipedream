import common from "../common.mjs";

export default {
  ...common,
  key: "ilovepdf-convert-files-to-pdf",
  name: "Convert Files to PDF",
  description: "Convert one or more files into PDF format. [See the documentation](https://developer.ilovepdf.com/docs/api-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    tool: {
      type: "string",
      label: "File Format",
      description: "The format of the file(s) to be processed.",
      options: [
        {
          label: "Image",
          value: "imagepdf",
        },
        {
          label: "Office",
          value: "officepdf",
        },
        {
          label: "HTML",
          value: "htmlpdf",
        },
      ],
    },
  },
  methods: {
    getTool() {
      return this.tool;
    },
  },
};

