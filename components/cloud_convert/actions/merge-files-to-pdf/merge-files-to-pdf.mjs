import app from "../../cloud_convert.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloud_convert-merge-files-to-pdf",
  name: "Merge Files To PDF",
  description: "Combines multiple input files into a single PDF file. [See the documentation](https://cloudconvert.com/api/v2/merge#merge-tasks)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    input: {
      type: "string[]",
      label: "Task IDs To Merge",
      description: "The IDs of the input tasks to be merged into a single PDF file, normally the import tasks.",
      propDefinition: [
        app,
        "taskId",
        () => ({
          filters: {
            ["filter[status]"]: constants.TASK_STATUS.FINISHED,
            ["filter[operation]"]: constants.TASK_OPERATION.IMPORT_URL,
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
            ["filter[operation]"]: constants.TASK_OPERATION.MERGE,
          },
        }),
      ],
    },
  },
  methods: {
    mergeTasks(args = {}) {
      return this.app.post({
        path: "/merge",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      mergeTasks,
      input,
      outputFormat,
    } = this;

    const response = await mergeTasks({
      $,
      data: {
        input,
        output_format: outputFormat,
      },
    });

    $.export("$summary", `Successfully merged tasks with ID \`${response.data.id}\``);

    return response;
  },
};
