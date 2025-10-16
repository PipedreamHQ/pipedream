import { defineAction } from "@pipedream/types";
import nectar_crm from "../../app/nectar_crm.app";
import constants from "../common/constants";

export default defineAction({
  key: "nectar_crm-create-task",
  name: "Create Task",
  description: "Created a new task. [See docs here](https://nectarcrm.docs.apiary.io/#reference/0/tarefas/criar)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nectar_crm,
    contactId: {
      propDefinition: [
        nectar_crm,
        "contactId",
      ],
    },
    title: {
      label: "Title",
      description: "The title of the task",
      type: "string",
    },
    dueDate: {
      label: "Due Date",
      description: "The due date to finish the task. E.g. `2022-07-20T00:00:00-03:00`",
      type: "string",
    },
    description: {
      label: "Description",
      description: "The description of the task",
      type: "string",
      optional: true,
    },
    priority: {
      label: "Priority",
      description: "The priority of the task",
      type: "string",
      options: constants.TASK_PRIORITIES,
      optional: true,
    },
    type: {
      label: "Type",
      description: "The type of the task.",
      type: "string",
      options: constants.TASK_TYPES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nectar_crm.createTask({
      $,
      data: {
        titulo: this.title,
        cliente: {
          id: this.contactId,
        },
        dataLimite: this.dueDate,
        descricao: this.description,
        prioridade: this.priority,
        tipo: this.type,
      },
    });

    $.export("$summary", `Successfully created task with id ${response.id}`);

    return response;
  },
});
