import planviewLeankit from "../../planview_leankit.app.mjs";
import { prepareDuplicateCardData } from "../common/utils.mjs";

export default {
  key: "planview_leankit-duplicate-card",
  name: "Duplicate Card",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Duplicate a card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/create)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    copiedFromCardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
      label: "Copied From Card Id",
      description: "The ID of the card that the new card will duplicate all the information from.",
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
      ...data
    } = this;

    const cardFrom = await planviewLeankit.getCard({
      cardId: this.copiedFromCardId,
    });

    const preparedData = prepareDuplicateCardData(cardFrom);

    const response = await planviewLeankit.createCard({
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
