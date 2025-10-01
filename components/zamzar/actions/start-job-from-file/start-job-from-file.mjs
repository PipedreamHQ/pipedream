import app from "../../zamzar.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zamzar-start-job-from-file",
  name: "Start Job From File",
  description: "Starts a conversion job and upload a source file in a single request. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sourceFile: {
      propDefinition: [
        app,
        "sourceFile",
      ],
    },
    targetFormat: {
      propDefinition: [
        app,
        "targetFormat",
      ],
    },
  },
  methods: {
    startJobFromFile(args = {}) {
      return this.app.post({
        path: "/jobs",
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      startJobFromFile,
      sourceFile,
      targetFormat,
    } = this;

    const response = await startJobFromFile({
      $,
      data: {
        source_file: sourceFile,
        target_format: targetFormat,
      },
    });

    $.export("$summary", `Started file conversion job with ID \`${response.id}\``);
    return response;
  },
};
