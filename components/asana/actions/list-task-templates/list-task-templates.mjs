import common from "../common/common.mjs";

export default {
  key: "asana-list-task-templates",
  name: "List Task Templates",
  description: "Returns all task templates in an Asana project. Use this to discover task template GIDs before calling **Create Task from Template** (the `taskTemplate` prop). Example: call with `project: '1204567890123456'` → returns templates like `[{gid: '1205678901234567', name: 'Bug Report Template'}]`. [See the documentation](https://developers.asana.com/reference/gettasktemplates)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    maxResults: {
      propDefinition: [
        common.props.asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const DEFAULT_LIMIT = 100;
    let hasMore, count = 0;
    const params = {
      project: this.project,
      limit: DEFAULT_LIMIT,
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.listTaskTemplates({
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (!data || data.length === 0) break;

      for (const template of data) {
        results.push(template);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `${results.length} task template${results.length !== 1
      ? "s"
      : ""} retrieved`);
    return results;
  },
};
