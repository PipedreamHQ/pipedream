import app from "../../cloud_convert.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloud_convert-convert-file",
  name: "Convert File",
  description: "Converts an input file to a specified output format using CloudConvert. [See the documentation](https://cloudconvert.com/api/v2/convert#convert-tasks)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    input: {
      propDefinition: [
        app,
        "taskId",
        () => ({
          filters: {
            ["filter[status]"]: constants.TASK_STATUS.FINISHED,
          },
        }),
      ],
    },
    outputFormat: {
      label: "Output Format",
      description: "The output format of the file to be converted",
      propDefinition: [
        app,
        "conversionType",
        () => ({
          mapper: ({ output_format: value }) => value,
          filters: {
            ["filter[operation]"]: constants.TASK_OPERATION.CONVERT,
          },
        }),
      ],
    },
  },
  methods: {
    convertFile(args = {}) {
      return this.app.post({
        path: "/convert",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      convertFile,
      input,
      outputFormat,
    } = this;

    const response = await convertFile({
      $,
      data: {
        input,
        output_format: outputFormat,
      },
    });

    $.export("$summary", `Successfully converted file with ID \`${response.data.id}\``);
    return response;
  },
};
