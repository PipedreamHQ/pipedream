import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-create-card-type",
  name: "Add Card Type To Board",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new card type on a board. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card-type/create)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the card type.",
    },
    colorHex: {
      type: "string",
      label: "Color Hex",
      description: "Background color for cards of this card type. E.g. `#000000`",
    },
    isCardType: {
      type: "boolean",
      label: "Is Card Type",
      description: "Determines if card type will be used for standard cards on a board.",
      optional: true,
    },
    isTaskType: {
      type: "boolean",
      label: "Is Task Type",
      description: "Determines if card type will be used for task cards.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      boardId,
      ...data
    } = this;

    const response = await planviewLeankit.createCardType({
      $,
      boardId,
      data,
    });

    $.export("$summary", `A new card type with id ${response.id} was successfully created!`);
    return response;
  },
};
