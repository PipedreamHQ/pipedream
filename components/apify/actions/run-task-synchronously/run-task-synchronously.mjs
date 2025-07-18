import apify from "../../apify.app.mjs";

export default {
  key: "apify-run-task-synchronously",
  name: "Run Task Synchronously",
  description: "Run a specific task and return its dataset items. [See the documentation](https://docs.apify.com/api/v2/actor-task-run-sync-get-dataset-items-get)",
  version: "0.0.3",
  type: "action",
  props: {
    apify,
    taskId: {
      propDefinition: [
        apify,
        "taskId",
      ],
      description: "The ID of the task to run",
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Optional timeout for the run, in seconds. By default, the run uses a timeout specified in the task settings.",
      optional: true,
    },
    memory: {
      type: "integer",
      label: "Memory",
      description: "Memory limit for the run, in megabytes. The amount of memory can be set to a power of 2 with a minimum of 128. By default, the run uses a memory limit specified in the task settings.",
      optional: true,
    },
    build: {
      type: "string",
      label: "Build",
      description: "Specifies the Actor build to run. It can be either a build tag or build number. By default, the run uses the build specified in the task settings (typically latest).",
      optional: true,
    },
    clean: {
      propDefinition: [
        apify,
        "clean",
      ],
    },
    fields: {
      propDefinition: [
        apify,
        "fields",
      ],
    },
    omit: {
      propDefinition: [
        apify,
        "omit",
      ],
    },
    flatten: {
      propDefinition: [
        apify,
        "flatten",
      ],
    },
    maxResults: {
      propDefinition: [
        apify,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.apify.runTaskSynchronously({
      $,
      taskId: this.taskId,
      params: {
        timeout: this.timeout,
        memory: this.memory,
        build: this.build,
        clean: this.clean,
        fields: this.fields && this.fields.join(),
        omit: this.omit && this.omit.join(),
        flatten: this.flatten && this.flatten.join(),
        maxItems: this.maxResults,
      },
    });

    $.export("$summary", `Successfully ran task with ID: ${this.taskId}`);

    return response;
  },
};
