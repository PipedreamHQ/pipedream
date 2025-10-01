import common from "../common/process-base.mjs";

export default {
  ...common,
  key: "ocrspace-process-pdf",
  name: "Process PDF for OCR",
  description: "Submit a PDF for OCR processing. [See the documentation](https://ocr.space/ocrapi)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    file: {
      propDefinition: [
        common.props.ocrspace,
        "file",
      ],
      label: "PDF File",
      description: "The URL of the PDF file or the path to the file saved to the `/tmp` directory  (e.g. `/tmp/example.pdf`)  to process. [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    getSummary() {
      return "Submitted PDF for OCR processing.";
    },
  },
};
