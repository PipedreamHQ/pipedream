import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-tags",
  name: "List Tags",
  description: "Returns tags in an Asana workspace, up to 100 by default (increase `maxResults` for more) — not guaranteed to include every tag in a large workspace. Use this to discover tag GIDs before applying tags to tasks with **Create Task** or **Create Subtask** (the `tags` prop). Example: call with `workspace: '1200123456789012'` → returns tags like `[{gid: '1202345678901234', name: 'urgent'}]`. [See the documentation](https://developers.asana.com/reference/gettags)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "The workspace GID to list tags for, e.g. `1200123456789012`. Use the **List Workspaces** action to find available workspace GIDs.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const defaultLimit = 100;
    let hasMore, count = 0;
    const params = {
      workspace: this.workspace,
      limit: defaultLimit,
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getTags({
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (!data || data.length === 0) break;

      for (const tag of data) {
        results.push(tag);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `${results.length} tag${results.length !== 1
      ? "s"
      : ""} retrieved`);
    return results;
  },
};
