import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-search-tasks-premium",
  name: "Search Tasks Premium",
  description: "Searches for a task by name, assignee, section, project, completed since, and modified since. Requires a Premium Asana account. [See the documentation](https://developers.asana.com/reference/searchtasksforworkspace)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
      description: "The assignee to filter tasks on",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
    section: {
      label: "Section",
      type: "string",
      description: "Section GID used to filter tasks (for example: `1200123456789013`). Provide `project` so valid section IDs can be resolved.",
      optional: true,
      propDefinition: [
        asana,
        "sections",
        (c) => ({
          project: c.project,
        }),
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
  },
  async run({ $ }) {
    const params = {
      "completed_on.after": this.completedSince,
      "modified_at.after": this.modifiedSince,
      "assignee.any": this.assignee,
      "sections.any": this.section,
      "projects.any": this.project,
      "text": this.name,
    };

    const { data: tasks } = await this.asana.searchTasks({
      workspace: this.workspace,
      params,
      $,
    });

    $.export("$summary", "Successfully retrieved tasks");

    return tasks;
  },
};
