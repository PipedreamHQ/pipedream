import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  name: "Add Task To Section",
  description: "Moves a task into a specific section within an Asana project, removing it from any other section it currently occupies in that project. Use **Search Sections** to find the section GID and **Search Tasks** to find the task GID. Returns an empty object `{}` on success. Example: call with `project: '1204567890123456'`, `task: '1202345678901234'`, `section_gid: '1203456789012345'` → task is moved into that section and returns `{}`. [See the documentation](https://developers.asana.com/docs/add-task-to-section)",
  key: "asana-add-task-to-section",
  version: "0.2.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    task: {
      label: "Task",
      type: "string",
      description: "The task to add to this section (a task GID, e.g. `1202345678901234`).",
      propDefinition: [
        asana,
        "tasks",
      ],
    },
    section_gid: {
      label: "Section GID",
      type: "string",
      description: "The globally unique identifier for the section.",
      propDefinition: [
        asana,
        "sections",
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
