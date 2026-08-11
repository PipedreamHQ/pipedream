// x-pd-ai: optimized
import { pickFields } from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";
import {
  DEFAULT_TASKS_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
} from "../../common/constants.mjs";

export default {
  key: "openphone-list-tasks",
  name: "List Tasks",
  description: "Retrieve a paginated list of tasks, optionally filtered by conversation. Use **List Conversations** or **List Messages** to find a `conversationId`. Example: call with no filters → returns up to 50 recent tasks across the organization. Use `fields` to return only specific fields per task. [See the documentation](https://www.openphone.com/docs/api-reference/tasks/list-tasks)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    conversationId: {
      propDefinition: [
        openphone,
        "conversationId",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        openphone,
        "maxResults",
      ],
      description: `Maximum number of tasks to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_TASKS_LIMIT}.`,
      default: DEFAULT_TASKS_LIMIT,
    },
    pageToken: {
      propDefinition: [
        openphone,
        "pageToken",
      ],
    },
    fields: {
      propDefinition: [
        openphone,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openphone.listTasks({
      $,
      params: {
        conversationId: this.conversationId,
        maxResults: this.maxResults,
        pageToken: this.pageToken,
      },
    });
    const tasks = response?.data ?? [];
    $.export("$summary", `Retrieved ${tasks.length} task${tasks.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      data: pickFields(tasks, this.fields),
    };
  },
};
