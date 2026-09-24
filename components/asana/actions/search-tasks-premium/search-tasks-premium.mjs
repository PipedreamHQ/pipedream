import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-search-tasks-premium",
  name: "Search Tasks Premium",
  description: "Searches for tasks across an Asana workspace by name, assignee, section, project, completed since, and/or modified since. Requires a Premium Asana account. Use this over **Search Tasks** when you need cross-project full-text search or date-range filters not available on the basic endpoint. Results are capped at 100 by the Asana search API — pagination is not supported on this endpoint; narrow your filters (name, assignee, modified_since) if you expect more than 100 matches. Example: call with `workspace: '1200123456789012'`, `name: 'Q3'`, `assignee: '1198765432109876'` → returns up to 100 tasks whose text contains 'Q3' assigned to that user. [See the documentation](https://developers.asana.com/reference/searchtasksforworkspace)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    asana,
    info: {
      type: "alert",
      alertType: "info",
      content: "This action requires a Premium Asana account. [See the documentation](https://developers.asana.com/reference/searchtasksforworkspace)",
    },
    ...common.props,
    project: {
      ...common.props.project,
      optional: true,
    },
    name: {
      label: "Name",
      description: "The task name to search for",
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
      description: "Section GID used to filter tasks (for example: `1200123456789013`). Provide `project` so valid section IDs can be resolved. Use **Search Sections** to find available section GIDs.",
      optional: true,
      propDefinition: [
        asana,
        "sections",
      ],
    },
    completedSince: {
      label: "Completed Since",
      type: "string",
      description: "Only return tasks that are either incomplete or completed since this time. ISO 8601 format (for example: `2026-04-14` or `2026-04-14T00:00:00Z`).",
      optional: true,
    },
    modifiedSince: {
      label: "Modified Since",
      type: "string",
      description: "Only return tasks modified since this time. ISO 8601 format (for example: `2026-04-14` or `2026-04-14T00:00:00Z`).",
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
    const params = {
      "completed_on.after": this.completedSince,
      "modified_at.after": this.modifiedSince,
      "assignee.any": this.assignee,
      "sections.any": this.section,
      "projects.any": this.project,
      "text": this.name,
      "limit": 100,
    };

    const { data: tasks } = await this.asana.searchTasks({
      workspace: this.workspace,
      params,
      $,
    });

    const taskList = tasks ?? [];
    const limited = this.maxResults
      ? taskList.slice(0, this.maxResults)
      : taskList;
    $.export("$summary", `Successfully retrieved ${limited.length} task${limited.length !== 1
      ? "s"
      : ""}`);
    return limited;
  },
};
