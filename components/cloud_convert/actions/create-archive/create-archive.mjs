import app from "../../cloud_convert.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloud_convert-create-archive",
  name: "Create Archive",
  description: "Creates an archive in a specified format. [See the documentation](https://cloudconvert.com/api/v2/archive#archive-tasks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    input: {
      type: "string[]",
      label: "Files To Archive",
      description: "The files to be included in the archive.",
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
      description: "The archive format.",
      propDefinition: [
        app,
        "conversionType",
        () => ({
          mapper: ({ output_format: value }) => value,
          filters: {
            ["filter[operation]"]: constants.TASK_OPERATION.ARCHIVE,
          },
        }),
      ],
    },
  },
  methods: {
    createArchive(args = {}) {
      return this.app.post({
        path: "/archive",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createArchive,
      input,
      outputFormat,
    } = this;

    const response = await createArchive({
      $,
      data: {
        input,
        output_format: outputFormat,
      },
    });

    $.export("$summary", `Successfully created archive with ID \`${response.data.id}\``);
    return response;
  },
};
