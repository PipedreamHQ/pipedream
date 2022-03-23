// legacy_hash_id: a_74iEBo
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "asana-search-tasks",
  name: "Search Tasks",
  description: "Searches for a Task by name within a Project.",
  version: "0.2.1",
  type: "action",
  props: {
    asana,
    name: {
      label: "Name",
      description: "The task name to search for.",
      type: "string",
    },
    assignee: {
      label: "Assignee",
      description: "The assignee to filter tasks on",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
    },
    project: {
      label: "Project",
      description: "The project to filter tasks on.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "projects",
      ],
    },
    section: {
      label: "Section",
      type: "string",
      description: "The section to filter tasks on.",
      optional: true,
      propDefinition: [
        asana,
        "sections",
        (c) => ({
          projects: c.projects,
        }),
      ],
    },
    workspace: {
      label: "Workspace",
      type: "string",
      description: "The workspace to filter tasks on.",
      optional: true,
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    completed_since: {
      label: "Completed Since",
      type: "string",
      description: "Only return tasks that are either incomplete or that have been completed since this time. ISO 8601 date string",
      optional: true,
    },
    modified_since: {
      label: "Modified Since",
      type: "string",
      description: "Only return tasks that have been modified since the given time. ISO 8601 date string",
      optional: true,
    },
  },
  async run({ $ }) {
    const tasks = await axios($, {
      url: `${this.asana._apiUrl()}/tasks`,
      headers: this.asana._headers(),
      params: {
        assignee: this.assignee,
        project: this.project,
        section: this.section,
        workspace: this.workspace,
        completed_since: this.completed_since,
        modified_since: this.modified_since,
      },
    });

    if (this.name) return tasks.data.filter((task) => task.name.includes(this.name));
    else return tasks.data;
  },
};
