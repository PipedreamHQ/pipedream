import { ConfigurationError } from "@pipedream/platform";
import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-remove-tags-from-card",
  name: "Remove Tags From Card",
  version: "0.0.1",
  description: "Remove tags from a card or task.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
  type: "action",
  props: {
    planview_leankit,
    cardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
    },
    taskId: {
      propDefinition: [
        planview_leankit,
        "taskId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        planview_leankit,
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
      planview_leankit,
      cardId,
      taskId,
      tags,
    } = this;

    try {
      const response = await planview_leankit.updateCard({
        $,
        cardId: taskId || cardId,
        data: tags.map((tagId, i) => ({
          "op": "remove",
          "path": `/tags/${i}`,
          "value": tagId,
        })),
      });

      $.export("$summary", `Tag${tags.length != 1
        ? "s were"
        : " was"} successfully updated!`);
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
