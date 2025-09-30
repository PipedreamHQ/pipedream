import airplane from "../../airplane.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "airplane-execute-task",
  name: "Execute Task",
  description: "Execute a task with a set of parameter values and receive a run ID to track the task's execution. [See the documentation](https://docs.airplane.dev/reference/api#tasks-execute)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    airplane,
    id: {
      type: "string",
      label: "Task ID",
      description: "Unique ID of the task. You can find your task's ID by visiting the task's page on Airplane. The task ID is located at the end of the url. e.g. the task ID for `https://app.airplane.dev/tasks/tsk20210728zxb2vxn` is `tsk20210728zxb2vxn` Either an ID or a slug must be provided.",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "Unique slug of the task. You can find your task's slug next to the task's name within the task editor on Airplane or by running `airplane tasks list` from the CLI. Either an ID or a slug must be provided.",
      optional: true,
    },
    paramValues: {
      type: "object",
      label: "Parameter Values",
      description: "Mapping of parameter slug to value. You can find your task's parameter slugs inside the task editor on Airplane or by running `airplane tasks list` from the CLI.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.id && !this.slug) {
      throw new ConfigurationError("Either an ID or a slug must be provided.");
    }

    const response = await this.airplane.executeTask({
      data: {
        id: this.id,
        slug: this.slug,
        paramValues: this.paramValues,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully executed task.");
    }

    return response;
  },
};
