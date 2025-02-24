import common from "../common/process-base.mjs";

export default {
  ...common,
  key: "ocrspace-process-image",
  name: "Process Image",
  description: "Submits an image file for OCR processing using OCR.space. [See the documentation](https://ocr.space/ocrapi)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    file: {
      propDefinition: [
        common.props.ocrspace,
        "file",
      ],
    },
    filetype: {
      propDefinition: [
        common.props.ocrspace,
        "filetype",
      ],
    },
  },
  methods: {
    getSummary() {
      return "Image submitted for OCR processing.";
    },
  },
};
