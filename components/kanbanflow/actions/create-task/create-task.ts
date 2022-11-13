import kanbanflow from "../../app/kanbanflow.app";
import { defineAction } from "@pipedream/types";
import {
  CreateTaskParams, Task,
} from "../../common/types";
import { getFlagPropDescription } from "../../common/constants";

export default defineAction({
  name: "Create Task",
  description: "Create a task (docs available on board settings)",
  key: "kanbanflow-create-task",
  version: "0.0.1",
  type: "action",
  methods: {
    splitFlagPropValue(value: string, splitKey: string): object {
      const splitValue = value.split(`!${splitKey}`);
      const returnObj = {
        name: splitValue[0],
      };
      if (splitValue.length > 1) returnObj[splitKey] = true;
      return returnObj;
    },
  },
  props: {
    kanbanflow,
    name: {
      label: "Name",
      description: "Task name.",
      type: "string",
    },
    columnId: {
      propDefinition: [
        kanbanflow,
        "columnId",
      ],
    },
    swimlaneId: {
      propDefinition: [
        kanbanflow,
        "swimlaneId",
      ],
      optional: true,
    },
    color: {
      propDefinition: [
        kanbanflow,
        "color",
      ],
      label: "Color",
      optional: true,
    },
    description: {
      label: "Description",
      description: "Task description.",
      optional: true,
    },
    responsibleUserId: {
      propDefinition: [
        kanbanflow,
        "userId",
      ],
      label: "Responsible User",
      optional: true,
    },
    subtasks: {
      label: "Subtasks",
      description: getFlagPropDescription("subtask", "finished"),
      type: "string[]",
    },
    labels: {
      label: "Labels",
      description: getFlagPropDescription("label", "pinned"),
      type: "string[]",
    },
    collaborators: {
      propDefinition: [
        kanbanflow,
        "userId",
      ],
      label: "Collaborators",
      description: "Select one or more **Users** from the list.",
      type: "string[]",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Any additional parameters to pass in the request body. See the **API docs** > **Create task**  for more info.",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const {
      name,
      columnId,
      swimlaneId,
      color,
      description,
      responsibleUserId,
      subtasks,
      labels,
      collaborators,
      additionalOptions,
    } = this;

    const params: CreateTaskParams = {
      $,
      data: {
        name,
        columnId,
        swimlaneId,
        color,
        description,
        responsibleUserId,
        subtasks: subtasks && this.splitFlagPropValue(subtasks, "finished"),
        labels: labels && this.splitFlagPropValue(labels, "pinned"),
        collaborators: collaborators?.map((userId: string) => ({
          userId,
        })),
        ...additionalOptions,
      },
    };
    const data: Task = await this.kanbanflow.createTask(params);

    $.export("$summary", `Successfully created task (id ${data.taskId})`);

    return data;
  },
});
