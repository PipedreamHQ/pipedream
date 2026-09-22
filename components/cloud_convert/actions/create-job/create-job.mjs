import app from "../../cloud_convert.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "cloud_convert-create-job",
  name: "Create Job",
  description: "Creates a new job for one or more tasks. [See the documentation](https://cloudconvert.com/api/v2/jobs#jobs-create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    tasks: {
      type: "object",
      label: "Tasks",
      description: `An object containing named tasks that form the job workflow. You can name tasks however you want, but **only alphanumeric characters, hyphens (-), and underscores (_) are allowed**.

**Each task object must include:**

- \`operation\` (string, **required**): The endpoint for creating the task (e.g., \`convert\`, \`import/url\`, \`import/s3\`, \`export/s3\`, etc.)
- \`input\` (string or array, optional): The name(s) of the input task(s). Use this to reference other tasks within the same job. Multiple task names can be provided as an array.
- \`ignore_error\` (boolean, optional): By default, the job fails if one task fails. Set to \`true\` to continue the job even if this specific task fails.
- Task-specific options (optional): Additional parameters that depend on the \`operation\` type. These are the same parameters used when creating the task via its direct endpoint.

**Example:**
\`\`\`json
{
  "import-my-file": {
    "operation": "import/url",
    "url": "https://example.com/document.pdf"
  },
  "convert-my-file": {
    "operation": "convert",
    "input": "import-my-file",
    "output_format": "jpg",
    "pages": "1-3"
  },
  "export-my-file": {
    "operation": "export/url",
    "input": ["convert-my-file"]
  }
}
\`\`\`

[See the tasks documentation](https://cloudconvert.com/api/v2/tasks)`,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "An arbitrary string to identify the job. Does not have any effect and can be used to associate with your application",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Single-job webhook URL receiving `job.finished` or `job.failed` events",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      tasks,
      tag,
      webhookUrl,
    } = this;

    const response = await app.createJob({
      $,
      data: {
        tasks: utils.parseJson(tasks),
        tag,
        webhook_url: webhookUrl,
      },
    });

    $.export("$summary", `Successfully created job with ID \`${response.data.id}\``);
    return response;
  },
};
