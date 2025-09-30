import { ConfigurationError } from "@pipedream/platform";
import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-unassign-user",
  name: "Unassign User",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Unassign an user from a card or a task. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
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
    assignedUserIds: {
      propDefinition: [
        planviewLeankit,
        "userId",
        ({
          cardId, taskId,
        }) => ({
          cardId: taskId || cardId,
        }),
      ],
      type: "string[]",
      description: "Collection of users.",
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
      taskId,
      assignedUserIds,
    } = this;
    try {
      const response = await planviewLeankit.updateCard({
        $,
        cardId: taskId || cardId,
        data: assignedUserIds.map((userId, i) => ({
          "op": "remove",
          "path": `/assignedUserIds/${i}`,
          "value": userId,
        })),
      });

      $.export("$summary", `${assignedUserIds.length} user${assignedUserIds.length != 1
        ? "s were"
        : " was"} successfully updated!`);
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
