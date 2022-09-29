import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-search-tasks",
  name: "Search Tasks",
  description: "Searches for a Task by name within a Project. [See the docs here](https://developers.asana.com/docs/get-multiple-tasks)",
  version: "0.2.1",
  type: "action",
  props: {
    ...common.props,
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
    section: {
      label: "Section",
      type: "string",
      description: "The section to filter tasks on.",
      optional: true,
      propDefinition: [
        asana,
        "sections",
        (c) => ({
          project: c.project,
        }),
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
    if ((!this.workspace || !this.assignee) && !this.project && !this.section) {
      throw new Error("You must specify exactly one of workspace, project, or section");
    }

    const tasks = await this.asana.getTasks({
      params: {
        assignee: this.assignee,
        project: this.project,
        section: this.section,
        workspace: this.workspace,
        completed_since: this.completed_since,
        modified_since: this.modified_since,
      },
    }, $);

    $.export("$summary", "Successfully retrieved tasks");

    if (this.name) return tasks.filter((task) => task.name.includes(this.name));
    else return tasks;
  },
};
