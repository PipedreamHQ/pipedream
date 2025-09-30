import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-uncompleted-tasks",
  name: "List Uncompleted Tasks",
  description: "Returns a list of uncompleted tasks by project, section, and/or label. [See the docs here](https://developer.todoist.com/rest/v2/#get-active-tasks)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    todoist,
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
    label: {
      propDefinition: [
        todoist,
        "label",
      ],
    },
  },
  async run ({ $ }) {
    const {
      project,
      section,
      label,
    } = this;
    const params = {
      project_id: project,
      section_id: section,
      label_id: label,
    };
    const resp = await this.todoist.getActiveTasks({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${resp.length} task${resp.length === 1
      ? ""
      : "s"}`);
    return resp;
  },
};
