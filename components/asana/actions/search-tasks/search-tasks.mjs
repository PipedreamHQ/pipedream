import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "asana-search-tasks",
  name: "Search Tasks",
  description: "Searches for Asana tasks by name within a project, section, or by assignee. Must specify exactly one of: `project`, `section`, or `assignee` (project + section together is also valid). The `name` filter is a client-side substring match applied after fetching. For cross-project full-text search, use **Search Tasks Premium** instead. Returns task records with `gid` and `name` (plus any requested `optFields`). Example: call with `workspace: '1200123456789012'`, `project: '1204567890123456'`, `name: 'Q3'` → returns tasks in that project whose names contain 'Q3'. [See the documentation](https://developers.asana.com/docs/get-multiple-tasks)",
  version: "0.5.3",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    project: {
      ...common.props.project,
      optional: true,
    },
    name: {
      label: "Name",
      description: "The task name to search for (client-side substring match). If omitted, all tasks matching the other filters are returned, e.g. `Q3 report`.",
      type: "string",
      optional: true,
    },
    assignee: {
      label: "Assignee",
      description: "The assignee to filter tasks on. Use **List Users** to find available user GIDs.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
    },
    section: {
      label: "Section",
      type: "string",
      description: "The section to filter tasks on. Must specify Project to list options. Use **Search Sections** to find available section GIDs.",
      optional: true,
      propDefinition: [
        asana,
        "sections",
      ],
    },
    completedSince: {
      label: "Completed Since",
      type: "string",
      description: "Only return tasks that are either incomplete or that have been completed since this time. ISO 8601 date string",
      optional: true,
    },
    modifiedSince: {
      label: "Modified Since",
      type: "string",
      description: "Only return tasks that have been modified since the given time. ISO 8601 date string",
      optional: true,
    },
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional task properties to include in the response (e.g. `created_at`, `due_on`, `custom_fields`). Nested paths are allowed; `gid` is always returned. [See the documentation](https://developers.asana.com/docs/get-multiple-tasks)",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    if (!this.project && !this.section && !this.assignee) {
      throw new ConfigurationError("Must specify one of Project, Section, or Assignee");
    }

    if ((this.project || this.section) && this.assignee) {
      throw new ConfigurationError("Must specify only one of Assignee, Project, or Project + Section");
    }

    const optFields = Array.isArray(this.optFields)
      ? [
        ...this.optFields,
      ]
      : [];
    if (this.name && optFields.length && !optFields.includes("name")) {
      // the name filter below needs task.name present in the response
      optFields.push("name");
    }

    let hasMore, count = 0;
    const params = {
      completed_since: this.completedSince,
      modified_since: this.modifiedSince,
      opt_fields: optFields.length
        ? optFields.join(",")
        : undefined,
      limit: 100,
    };

    if (this.assignee) {
      params.assignee = this.assignee;
      params.workspace = this.workspace;
    } else if (this.section) {
      params.section = this.section;
    } else {
      params.project = this.project;
    }

    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getTasks({
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (!data?.length) break;

      for (const task of data) {
        if (this.name && !task.name?.includes(this.name)) continue;
        results.push(task);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `${results.length} task${results.length !== 1
      ? "s"
      : ""} retrieved${results.length >= this.maxResults
      ? " (maxResults reached)"
      : ""}`);
    return results;
  },
};
