import planviewLeankit from "../../planview_leankit.app.mjs";
import { prepareDuplicateCardData } from "../common/utils.mjs";

export default {
  key: "planview_leankit-duplicate-task",
  name: "Duplicate Task",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Duplicate a task. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/create)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
    },
    copiedFromTaskId: {
      propDefinition: [
        planviewLeankit,
        "taskId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      label: "Copied From Task Id",
      description: "The ID of the task that the new task will duplicate all the information from.",
    },
    title: {
      propDefinition: [
        planviewLeankit,
        "title",
      ],
    },
    description: {
      propDefinition: [
        planviewLeankit,
        "description",
      ],
      optional: true,
    },
    laneId: {
      propDefinition: [
        planviewLeankit,
        "laneId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        planviewLeankit,
        "priority",
      ],
      optional: true,
    },
    size: {
      propDefinition: [
        planviewLeankit,
        "size",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        planviewLeankit,
        "typeId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
      boardId,
      copiedFromTaskId,
      ...data
    } = this;

    const cardFrom = await planviewLeankit.getCard({
      boardId,
      cardId: copiedFromTaskId,
    });

    const preparedData = prepareDuplicateCardData(cardFrom);

    const response = await planviewLeankit.createTask({
      $,
      cardId,
      data: {
        copiedFromCardId: copiedFromTaskId,
        ...preparedData,
        ...data,
      },
    });

    $.export("$summary", `A new task with id ${response.id} was successfully created!`);
    return response;
  },
};
