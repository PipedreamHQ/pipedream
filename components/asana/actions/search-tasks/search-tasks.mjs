import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "asana-search-tasks",
  name: "Search Tasks",
  description: "Searches for tasks by name across a workspace, or within a specific project, section, or assignee. Supports workspace-wide task search by name alone. [See the documentation](https://developers.asana.com/docs/search-tasks-in-a-workspace)",
  version: "0.3.6",
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
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
    section: {
      label: "Section",
      type: "string",
      description: "The section to filter tasks on. Must specify Project to list options.",
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
      description: "Only return tasks that are either incomplete or that have been completed since this time. ISO 8601 date string",
      optional: true,
    },
    modifiedSince: {
      label: "Modified Since",
      type: "string",
      description: "Only return tasks that have been modified since the given time. ISO 8601 date string",
      optional: true,
    },
  },
  async run({ $ }) {
    let tasks;

    if (this.project || this.section || this.assignee) {
      if ((this.project || this.section) && this.assignee) {
        throw new ConfigurationError("Must specify only one of Assignee, Project, or Project + Section");
      }

      const params = {
        completed_since: this.completedSince,
        modified_since: this.modifiedSince,
      };

      if (this.assignee) {
        params.assignee = this.assignee;
        params.workspace = this.workspace;
      } else if (this.section) {
        params.section = this.section;
      } else {
        params.project = this.project;
      }

      ({ data: tasks } = await this.asana.getTasks({
        params,
        $,
      }));

      if (this.name) tasks = tasks.filter((task) => task.name.includes(this.name));
    } else {
      const params = {};
      if (this.name) params.text = this.name;
      if (this.completedSince) params["completed_on.after"] = this.completedSince;
      if (this.modifiedSince) params["modified_on.after"] = this.modifiedSince;

      ({ data: tasks } = await this.asana._makeRequest({
        path: `workspaces/${this.workspace}/tasks/search`,
        params,
        $,
      }));
    }

    $.export("$summary", "Successfully retrieved tasks");
    return tasks;
  },
};
