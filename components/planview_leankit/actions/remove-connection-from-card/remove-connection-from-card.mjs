import { ConfigurationError } from "@pipedream/platform";
import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-remove-connection-from-card",
  name: "Remove Parent/Child Connection",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Remove parent or child connection from a card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/connections/delete-many)",
  type: "action",
  props: {
    planviewLeankit,
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
    },
    parentCardId: {
      propDefinition: [
        planviewLeankit,
        "parentCardId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    childCardId: {
      propDefinition: [
        planviewLeankit,
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
      planviewLeankit,
      cardId,
      parentCardId,
      childCardId,
    } = this;

    try {
      const response = await planviewLeankit.deleteConnections({
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

      $.export("$summary", `Connections with ids (${parentCardId.toString(), childCardId.toString()}) were successfully removed!`);
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
