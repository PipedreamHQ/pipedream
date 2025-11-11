import { ConfigurationError } from "@pipedream/platform";
import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-add-connection-to-card",
  name: "Create a Parent/Child Connection",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add parent or child connection to a card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/connections/create)",
  type: "action",
  props: {
    planviewLeankit,
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
    },
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
      description: "The ID of the board you want to select cards from.",
    },
    parentCardId: {
      propDefinition: [
        planviewLeankit,
        "parentCardId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    childCardId: {
      propDefinition: [
        planviewLeankit,
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
      planviewLeankit,
      cardId,
      parentCardId,
      childCardId,
    } = this;

    try {
      const response = await planviewLeankit.createConnections({
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

      $.export("$summary", `Connections with ids (${parentCardId.toString()},${childCardId.toString()}) were successfully added!`);
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
