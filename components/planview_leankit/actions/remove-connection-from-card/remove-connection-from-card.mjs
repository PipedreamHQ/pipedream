import { ConfigurationError } from "@pipedream/platform";
import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-remove-connection-from-card",
  name: "Remove Parent/Child Connection",
  version: "0.0.1",
  description: "Remove parent or child connection from a card.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/connections/delete-many)",
  type: "action",
  props: {
    planview_leankit,
    cardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
    },
    parentCardId: {
      propDefinition: [
        planview_leankit,
        "parentCardId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    childCardId: {
      propDefinition: [
        planview_leankit,
        "childCardId",
        ({ cardId }) => ({
          cardId,
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
      const response = await planview_leankit.deleteConnections({
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

      $.export("$summary", "Connections were successfully removed!");
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
