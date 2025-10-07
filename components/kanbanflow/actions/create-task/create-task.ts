import kanbanflow from "../../app/kanbanflow.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import {
  CreateTaskParams, Task,
} from "../../common/types";
import { getFlagPropDescription } from "../../common/utils";

export default defineAction({
  name: "Create Task",
  description: "Create a task (docs available on board settings)",
  key: "kanbanflow-create-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      type: "string",
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
      optional: true,
    },
    labels: {
      label: "Labels",
      description: getFlagPropDescription("label", "pinned"),
      type: "string[]",
      optional: true,
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
      type: "string",
      label: "Additional Options",
      description:
        "A JSON-stringified object with any additional parameters to pass in the request body. See the **API docs** > **Create task**  for more info.",
      optional: true,
    },
  },
  async run({ $ }): Promise<Task> {
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
    } = this;

    let additionalOptions: object;
    if (this.additionalOptions) {
      try {
        additionalOptions = JSON.parse(this.additionalOptions);
      } catch (err) {
        throw new ConfigurationError("Error when parsing the **additionalOptions** prop. Check if it is a valid JSON-stringified object.");
      }
    }

    const params: CreateTaskParams = {
      $,
      data: {
        name,
        columnId,
        swimlaneId,
        color: color?.toLowerCase(),
        description,
        responsibleUserId,
        subTasks: subtasks?.map((value) => this.splitFlagPropValue(value, "finished")),
        labels: labels?.map((value) => this.splitFlagPropValue(value, "pinned")),
        collaborators: collaborators?.filter((id: string) => id !== responsibleUserId).map((userId: string) => ({
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
