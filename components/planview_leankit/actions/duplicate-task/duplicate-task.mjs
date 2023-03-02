import planview_leankit from "../../planview_leankit.app.mjs";
import { prepareDuplicateCardData } from "../common/utils.mjs";

export default {
  key: "planview_leankit-duplicate-task",
  name: "Duplicate Task",
  version: "0.0.1",
  description: "Duplicate a task. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/create)",
  type: "action",
  props: {
    planview_leankit,
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
    },
    cardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
    },
    copiedFromTaskId: {
      propDefinition: [
        planview_leankit,
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
        planview_leankit,
        "title",
      ],
    },
    description: {
      propDefinition: [
        planview_leankit,
        "description",
      ],
      optional: true,
    },
    laneId: {
      propDefinition: [
        planview_leankit,
        "laneId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        planview_leankit,
        "priority",
      ],
      optional: true,
    },
    size: {
      propDefinition: [
        planview_leankit,
        "size",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        planview_leankit,
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
      planview_leankit,
      cardId,
      boardId,
      copiedFromTaskId,
      ...data
    } = this;

    const cardFrom = await planview_leankit.getCard({
      boardId,
      cardId: copiedFromTaskId,
    });

    const preparedData = prepareDuplicateCardData(cardFrom);

    const response = await planview_leankit.createTask({
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
