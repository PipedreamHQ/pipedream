import common from "../common/common.mjs";

export default {
  key: "asana-list-task-stories",
  name: "List Task Stories",
  description: "Returns all stories (comments, activity log entries, system messages) for an Asana task. Use this to retrieve the comment history and audit trail for a task. Set `commentsOnly: true` to filter to only comment stories. Returns an array of story records each with `gid`, `type`, `text`, and `created_at`. Example: call with `project: '1204567890123456'`, `taskId: '1202345678901234'` → returns stories including `{gid: '1209012345678901', type: 'comment', text: 'Approved!', created_at: '2026-09-01T10:00:00Z'}`. [See the documentation](https://developers.asana.com/reference/getstoriesfortask)",
  version: "0.0.8",
  ai: "optimized",
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
      description: "The ID of the task to retrieve stories for, e.g. `1202345678901234`. Use **Search Tasks** to find available task GIDs.",
      type: "string",
      propDefinition: [
        common.props.asana,
        "tasks",
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
      propDefinition: [
        common.props.asana,
        "maxResults",
      ],
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

    // commentsOnly filters on story.type below, so that field must always be
    // requested — it isn't part of the API's compact default and would
    // otherwise be silently undefined whenever the caller supplies their own
    // optFields, making every story fail the filter.
    const optFields = new Set([
      "gid",
      "type",
      "text",
      "created_at",
    ]);
    if (Array.isArray(this.optFields)) {
      for (const field of this.optFields) {
        optFields.add(field);
      }
    }

    const params = {
      limit: 100,
      opt_fields: [
        ...optFields,
      ].join(","),
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
