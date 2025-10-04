import { ConfigurationError } from "@pipedream/platform";
import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-remove-tags-from-card",
  name: "Remove Tags From Card",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Remove tags from a card or task. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
  type: "action",
  props: {
    planviewLeankit,
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
    },
    taskId: {
      propDefinition: [
        planviewLeankit,
        "taskId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        planviewLeankit,
        "cardTags",
        ({
          cardId, taskId,
        }) => ({
          cardId: taskId || cardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
      taskId,
      tags,
    } = this;

    try {
      const response = await planviewLeankit.updateCard({
        $,
        cardId: taskId || cardId,
        data: tags.map((tagId, i) => ({
          "op": "remove",
          "path": `/tags/${i}`,
          "value": tagId,
        })),
      });

      $.export("$summary", `${tags.length} tag${tags.length != 1
        ? "s were"
        : " was"} successfully updated!`);
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
