import planview_leankit from "../../planview_leankit.app.mjs";
import { prepareDuplicateCardData } from "../common/utils.mjs";

export default {
  key: "planview_leankit-duplicate-card",
  name: "Duplicate Card",
  version: "0.0.1",
  description: "Duplicate a card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/create)",
  type: "action",
  props: {
    planview_leankit,
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
    },
    copiedFromCardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
      label: "Copied From Card Id",
      description: "The ID of the card that the new card will duplicate all the information from.",
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
      ...data
    } = this;

    const cardFrom = await planview_leankit.getCard({
      cardId: this.copiedFromCardId,
    });

    const preparedData = prepareDuplicateCardData(cardFrom);

    const response = await planview_leankit.createCard({
      $,
      data: {
        ...preparedData,
        ...data,
      },
    });

    $.export("$summary", `A new card with id ${response.id} was successfully created!`);
    return response;
  },
};
