import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-uncompleted-tasks",
  name: "List Uncompleted Tasks",
  description: "Returns a list of uncompleted tasks by project, section, and/or label. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/get_tasks_api_v1_tasks_get)",
  version: "0.0.5",
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
    $.export("$summary", `Successfully retrieved ${resp?.results?.length} task${resp?.results?.length === 1
      ? ""
      : "s"}`);
    return resp?.results;
  },
};
