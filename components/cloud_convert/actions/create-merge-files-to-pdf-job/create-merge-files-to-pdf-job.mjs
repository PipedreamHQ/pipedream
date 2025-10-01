import app from "../../cloud_convert.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloud_convert-create-merge-files-to-pdf-job",
  name: "Create Merge Files To PDF Job",
  description: "Combines multiple input files into a single PDF file and create an export URL with a job. [See the documentation](https://cloudconvert.com/api/v2/merge#merge-tasks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    urls: {
      type: "string[]",
      label: "PDF URLs",
      description: "The URLs of the PDF files to merge.",
      optional: true,
    },
    filename: {
      description: "Choose a filename (including extension) for the output file.",
      propDefinition: [
        app,
        "filename",
      ],
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "An arbitrary string to identify the job. Does not have any effect and can be used to associate the job with an ID in your application.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "A [webhook](https://cloudconvert.com/api/v2/webhooks) that is used for this single job only. The url will receive a job.finished or job.failed event. We do recommend using account wide webhooks which can be created via the dashboard.",
      optional: true,
    },
  },
  methods: {
    getFileTasksByUrls(urls) {
      return urls.reduce((tasks, url, idx) => {
        const key = `file${idx + 1}`;
        return {
          ...tasks,
          [key]: {
            operation: constants.TASK_OPERATION.IMPORT_URL,
            url,
            filename: `${key}.pdf`,
          },
        };
      }, {});
    },
    getMergeFilesToPdfTasks({
      urls, filename,
    } = {}) {
      const fileTasks = this.getFileTasksByUrls(urls);
      return {
        ...fileTasks,
        merged: {
          operation: constants.TASK_OPERATION.MERGE,
          output_format: "pdf",
          input: Object.keys(fileTasks),
          filename,
        },
        output: {
          operation: constants.TASK_OPERATION.EXPORT_URL,
          input: [
            "merged",
          ],
          inline: false,
          archive_multiple_files: false,
        },
      };
    },
  },
  async run({ $ }) {
    const {
      getMergeFilesToPdfTasks,
      app,
      tag,
      webhookUrl,
      ...props
    } = this;

    const response = await app.createJob({
      $,
      data: {
        tasks: getMergeFilesToPdfTasks(props),
        tag,
        webhook_url: webhookUrl,
      },
    });

    $.export("$summary", `Successfully created job with ID \`${response.data.id}\``);

    return response;
  },
};
