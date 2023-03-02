import { ConfigurationError } from "@pipedream/platform";
import planview_leankit from "../../planview_leankit.app.mjs";
import { prepareData } from "../common/utils.mjs";

export default {
  key: "planview_leankit-update-card",
  name: "Update Card (Or Task)",
  version: "0.0.1",
  description: "Update a card or task's fields.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
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
    title: {
      propDefinition: [
        planview_leankit,
        "title",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        planview_leankit,
        "typeId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    assignedUserIds: {
      propDefinition: [
        planview_leankit,
        "userId",
      ],
      type: "string[]",
      description: "Collection of users.",
      optional: true,
    },
    customIconId: {
      propDefinition: [
        planview_leankit,
        "customIconId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    customId: {
      propDefinition: [
        planview_leankit,
        "customId",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        planview_leankit,
        "customFields",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        planview_leankit,
        "description",
      ],
      optional: true,
    },
    externalLink: {
      propDefinition: [
        planview_leankit,
        "externalLink",
      ],
      optional: true,
    },
    index: {
      propDefinition: [
        planview_leankit,
        "index",
      ],
      optional: true,
    },
    isBlocked: {
      propDefinition: [
        planview_leankit,
        "isBlocked",
      ],
      reloadProps: true,
      optional: true,
    },
    laneId: {
      propDefinition: [
        planview_leankit,
        "laneId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    parentCardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
      label: "Parent Card Id",
      description: "The parent card.",
      optional: true,
    },
    planningSeriesId: {
      propDefinition: [
        planview_leankit,
        "planningSeriesId",
      ],
      optional: true,
    },
    planningIncrementIds: {
      propDefinition: [
        planview_leankit,
        "planningIncrementIds",
        ({ planningSeriesId }) => ({
          planningSeriesId,
        }),
      ],
      optional: true,
    },
    mirrorSourceCardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
      label: "Mirror Source Card Id",
      description: "The card that is the source for mirroring title, description and customId to this card.",
      optional: true,
    },
    size: {
      propDefinition: [
        planview_leankit,
        "size",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        planview_leankit,
        "tags",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
    },
    wipOverrideComment: {
      propDefinition: [
        planview_leankit,
        "wipOverrideComment",
      ],
      description: "This should be specified with a laneId update operation that would violate a WIP limit.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isBlocked) {
      props.blockReason = {
        propDefinition: [
          planview_leankit,
          "blockReason",
        ],
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardId,
      taskId,
      ...data
    } = this;

    try {
      const response = await planview_leankit.updateCard({
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
