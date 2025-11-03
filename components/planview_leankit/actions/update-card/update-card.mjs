import { ConfigurationError } from "@pipedream/platform";
import planviewLeankit from "../../planview_leankit.app.mjs";
import { prepareData } from "../common/utils.mjs";

export default {
  key: "planview_leankit-update-card",
  name: "Update Card (Or Task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a card or task's fields. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
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
    title: {
      propDefinition: [
        planviewLeankit,
        "title",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        planviewLeankit,
        "typeId",
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
      ],
      type: "string[]",
      description: "Collection of users.",
      optional: true,
    },
    customIconId: {
      propDefinition: [
        planviewLeankit,
        "customIconId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    customId: {
      propDefinition: [
        planviewLeankit,
        "customId",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        planviewLeankit,
        "customFields",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        planviewLeankit,
        "description",
      ],
      optional: true,
    },
    externalLink: {
      propDefinition: [
        planviewLeankit,
        "externalLink",
      ],
      optional: true,
    },
    index: {
      propDefinition: [
        planviewLeankit,
        "index",
      ],
      optional: true,
    },
    laneId: {
      propDefinition: [
        planviewLeankit,
        "laneId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    parentCardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
      label: "Parent Card Id",
      description: "The parent card.",
      optional: true,
    },
    planningSeriesId: {
      propDefinition: [
        planviewLeankit,
        "planningSeriesId",
      ],
      optional: true,
    },
    planningIncrementIds: {
      propDefinition: [
        planviewLeankit,
        "planningIncrementIds",
        ({ planningSeriesId }) => ({
          planningSeriesId,
        }),
      ],
      optional: true,
    },
    mirrorSourceCardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
      label: "Mirror Source Card Id",
      description: "The card that is the source for mirroring title, description and customId to this card.",
      optional: true,
    },
    size: {
      propDefinition: [
        planviewLeankit,
        "size",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        planviewLeankit,
        "tags",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    wipOverrideComment: {
      propDefinition: [
        planviewLeankit,
        "wipOverrideComment",
      ],
      description: "This should be specified with a laneId update operation that would violate a WIP limit.",
      optional: true,
    },
    isBlocked: {
      propDefinition: [
        planviewLeankit,
        "isBlocked",
      ],
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isBlocked) {
      props.blockReason = {
        propDefinition: [
          planviewLeankit,
          "blockReason",
        ],
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
      taskId,
      ...data
    } = this;

    try {
      const response = await planviewLeankit.updateCard({
        $,
        cardId: taskId || cardId,
        data: prepareData(data),
      });

      $.export("$summary", `The ${taskId
        ? "task"
        : "card"} with id ${taskId || cardId} was successfully updated!`);
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
