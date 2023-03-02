import { ConfigurationError } from "@pipedream/platform";
import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-add-connection-to-card",
  name: "Create a Parent/Child Connection",
  version: "0.0.1",
  description: "Add parent or child connection to a card.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/connections/create)",
  type: "action",
  props: {
    planview_leankit,
    cardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
    },
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
      description: "The ID of the board you want to select cards from.",
    },
    parentCardId: {
      propDefinition: [
        planview_leankit,
        "parentCardId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    childCardId: {
      propDefinition: [
        planview_leankit,
        "childCardId",
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
      parentCardId,
      childCardId,
    } = this;

    try {
      const response = await planview_leankit.createConnections({
        $,
        data: {
          cardIds: [
            cardId,
          ],
          connections: {
            parents: parentCardId,
            children: childCardId,
          },
        },
      });

      $.export("$summary", "Connections were successfully added!");
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
