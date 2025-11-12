import bytenite from "../../bytenite.app.mjs";

export default {
  key: "bytenite-create-job",
  name: "Create Video Encoding Task",
  description: "Creates a new video encoding task with ByteNite. [See the documentation](https://docs.bytenite.com/reference/customer_createjob)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bytenite,
    name: {
      type: "string",
      label: "Name",
      description: "Mnemonic name for the job.",
    },
    templateId: {
      propDefinition: [
        bytenite,
        "templateId",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the video to encode",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "Unique identifier for the job, automatically generated if left blank.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Textual description of the job.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bytenite.createJob({
      $,
      data: {
        name: this.name,
        templateId: this.templateId,
        jobId: this.jobId,
        description: this.description,
        dataSource: {
          dataSourceDescriptor: "url",
          params: {
            "@type": "type.googleapis.com/bytenite.data_source.HttpDataSource",
            "url": this.url,
          },
        },
      },
    });
    $.export("$summary", `Successfully created video encoding task with ID: ${response.job.id}`);
    return response;
  },
};
