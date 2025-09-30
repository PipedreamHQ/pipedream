import common from "../common/common.mjs";

export default {
  key: "asana-list-task-stories",
  name: "List Task Stories",
  description: "List stories (including comments) for a task. [See the documentation](https://developers.asana.com/reference/getstoriesfortask)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    taskId: {
      label: "Task GID",
      description: "The ID of the task to retrieve stories for",
      type: "string",
      propDefinition: [
        common.props.asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    commentsOnly: {
      type: "boolean",
      label: "Comments Only",
      description: "Only return comments",
      optional: true,
    },
    optFields: {
      type: "string[]",
      label: "Opt Fields",
      description: "This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. See the [documentation](https://developers.asana.com/reference/stories) for available fields.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  methods: {
    async getStoriesForTask({
      taskId, ...opts
    }) {
      return this.asana._makeRequest({
        path: `tasks/${taskId}/stories`,
        ...opts,
      });
    },
  },
  async run({ $ }) {
    let hasMore, count = 0;

    const params = {
      limit: this.maxResults,
      opt_fields: this.optFields
        ? this.optFields?.join(",")
        : undefined,
    };

    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.getStoriesForTask({
        $,
        taskId: this.taskId,
        params,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) {
        break;
      }

      for (const story of data) {
        if (this.commentsOnly && story.type !== "comment") {
          continue;
        }
        results.push(story);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `Found ${results.length} stories`);
    return results;
  },
};
