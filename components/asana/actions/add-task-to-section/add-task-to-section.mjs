import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  name: "Add Task To Section",
  description: "Add a task to a specific, existing section. This will remove the task from other sections of the project. [See the documentation](https://developers.asana.com/docs/add-task-to-section)",
  key: "asana-add-task-to-section",
  version: "0.2.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    task: {
      label: "Task",
      type: "string",
      description: "The task to add to this section.",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    section_gid: {
      label: "Section GID",
      type: "string",
      description: "The globally unique identifier for the section.",
      propDefinition: [
        asana,
        "sections",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    insert_before: {
      label: "Insert Before",
      type: "string",
      description: "An existing task within this section before which the added task should be inserted. Cannot be provided together with insert_after.",
      optional: true,
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    insert_after: {
      label: "Insert After",
      type: "string",
      description: "An existing task within this section after which the added task should be inserted. Cannot be provided together with insert_before.",
      optional: true,
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.asana._makeRequest({
      path: `sections/${this.section_gid}/addTask`,
      method: "post",
      data: {
        data: {
          task: this.task,
          insert_before: this.insert_before,
          insert_after: this.insert_after,
        },
      },
      $,
    });

    $.export("$summary", "Successfully added task to section");

    return response;
  },
};
