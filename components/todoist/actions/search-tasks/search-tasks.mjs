import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-search-tasks",
  name: "Search Tasks",
  description: "Search tasks by name, label, project and/or section. [See Docs](https://developer.todoist.com/rest/v2/#get-active-tasks)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    name: {
      type: "string",
      label: "Name Match",
      description: "Returns tasks that contain the specified string in their name",
      optional: true,
    },
    label: {
      propDefinition: [
        todoist,
        "label",
      ],
    },
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
    section: {
      propDefinition: [
        todoist,
        "section",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const {
      name,
      label,
      project,
      section,
    } = this;
    const label_name = label ? (await this.todoist.getLabels({id: label})).name : "";
    const tasks = await this.todoist.getActiveTasks({
      $,
      params: {
        label: label_name,
        project_id: project,
        section_id: section,
      },
    });
    let result = name ? tasks.filter((task) => task.content.includes(name)) : tasks;
    let summary = `${result.length} task${result.length == 1
      ? ""
      : "s"} found`;
    $.export("$summary", summary);
    return result;
  },
};
