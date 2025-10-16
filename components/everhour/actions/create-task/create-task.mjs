import { STATUS_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import everhour from "../../everhour.app.mjs";

export default {
  key: "everhour-create-task",
  name: "Create Task",
  description: "Creates a new task in Everhour. [See the documentation](https://everhour.docs.apiary.io/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    everhour,
    projectId: {
      propDefinition: [
        everhour,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Task Name",
      description: "The name of the task to be created.",
    },
    sectionId: {
      propDefinition: [
        everhour,
        "sectionId",
        ({ projectId })  => ({
          projectId,
        }),
      ],
    },
    tags: {
      propDefinition: [
        everhour,
        "tags",
      ],
      optional: true,
    },
    position: {
      type: "integer",
      label: "Position",
      description: "The position of the task",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the task",
      optional: true,
    },
    dueOn: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task. **Format: YYYY-MM-DD**",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task",
      options: STATUS_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.everhour.createTask({
      $,
      projectId: this.projectId,
      data: {
        name: this.name,
        section: this.sectionId,
        tags: this.tags && parseObject(this.tags),
        position: this.position,
        description: this.description,
        dueOn: this.dueOn,
        status: this.status,
      },
    });

    $.export("$summary", `Successfully created task with ID: ${response.id}`);
    return response;
  },
};
