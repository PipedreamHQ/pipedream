import apify from "../../apify.app.mjs";
import { ACTOR_JOB_STATUSES } from "@apify/consts";

export default {
  key: "apify-run-task-synchronously",
  name: "Run Task Synchronously",
  description: "Run a specific task and return its dataset items. [See the documentation](https://docs.apify.com/api/v2/actor-task-run-sync-get-dataset-items-get)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    // Retrieve dataset output option
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
    limit: {
      propDefinition: [
        apify,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      status,
      id,
      actId,
      startedAt,
      finishedAt,
      options: { build },
      buildId,
      defaultKeyValueStoreId,
      defaultDatasetId,
      defaultRequestQueueId,
      consoleUrl,
    } = await this.apify.runTaskSynchronously({
      taskId: this.taskId,
      params: {
        timeout: this.timeout,
        memory: this.memory,
        build: this.build,
      },
    });

    if (status !== ACTOR_JOB_STATUSES.SUCCEEDED) {
      throw new Error(`Run has finished with status: ${status}. Inspect it here: ${consoleUrl}`);
    }

    const { items } = await this.apify.listDatasetItems({
      datasetId: defaultDatasetId,
      params: {
        clean: this.clean,
        fields: this.fields,
        omit: this.omit,
        flatten: this.flatten,
        limit: this.limit,
      },
    });

    $.export("$summary", `Run with task id ${this.taskId} finished successfully.`);
    return {
      runId: id,
      actId,
      startedAt,
      finishedAt,
      build,
      buildId,
      defaultKeyValueStoreId,
      defaultDatasetId,
      defaultRequestQueueId,
      items,
    };
  },
};
