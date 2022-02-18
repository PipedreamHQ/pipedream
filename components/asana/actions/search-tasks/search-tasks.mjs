// legacy_hash_id: a_74iEBo
import { axios } from "@pipedream/platform";

export default {
  key: "asana-search-tasks",
  name: "Search Tasks",
  description: "Searches for a Task by name within a Project.",
  version: "0.1.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    name: {
      type: "string",
      description: "The task name to search for.",
    },
    assignee: {
      type: "string",
      description: "The assignee to filter tasks on. Note: If you specify assignee, you must also specify the workspace to filter on.",
      optional: true,
    },
    project: {
      type: "string",
      description: "The project to filter tasks on.",
    },
    section: {
      type: "string",
      description: "The section to filter tasks on.",
      optional: true,
    },
    workspace: {
      type: "string",
      description: "The workspace to filter tasks on. Note: If you specify workspace, you must also specify the assignee to filter on.",
      optional: true,
    },
    completed_since: {
      type: "string",
      description: "Only return tasks that are either incomplete or that have been completed since this time.",
      optional: true,
    },
    modified_since: {
      type: "string",
      description: "Only return tasks that have been modified since the given time.",
      optional: true,
    },
  },
  async run({ $ }) {
    let tasks = null;
    let matches = [];
    let query = this.name;
    const asanaParams = [
      "assignee",
      "project",
      "section",
      "workspace",
      "completed_since",
      "modified_since",
    ];
    let p = this;

    const queryString = asanaParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    tasks = await axios($, {
      url: `https://app.asana.com/api/1.0/tasks?${queryString}`,
      headers: {
        Authorization: `Bearer ${this.asana.$auth.oauth_access_token}`,
      },
    });

    if (tasks) {
      tasks.data.forEach(function(task) {
        if (task.name.includes(query))
          matches.push(task);
      });
    }

    return matches;
  },
};
