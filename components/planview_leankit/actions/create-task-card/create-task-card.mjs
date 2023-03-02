import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-create-task-card",
  name: "Create Task Card",
  version: "0.0.1",
  description: "Create a task card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/create-task)",
  type: "action",
  props: {
    planview_leankit,
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
    },
    cardId: {
      propDefinition: [
        planview_leankit,
        "cardId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
    },
    title: {
      propDefinition: [
        planview_leankit,
        "title",
      ],
    },
    typeId: {
      propDefinition: [
        planview_leankit,
        "typeId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
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
    description: {
      propDefinition: [
        planview_leankit,
        "description",
      ],
      optional: true,
    },
    size: {
      propDefinition: [
        planview_leankit,
        "size",
      ],
      optional: true,
    },
    laneId: {
      propDefinition: [
        planview_leankit,
        "laneId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    connectionsParent: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
      label: "Parents Connections",
      type: "string[]",
      description: "The parents connections.",
      optional: true,
    },
    connectionsChild: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
      label: "Children Connections",
      type: "string[]",
      description: "The children connections.",
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
    priority: {
      propDefinition: [
        planview_leankit,
        "priority",
      ],
      optional: true,
    },
    customIconId: {
      propDefinition: [
        planview_leankit,
        "customIconId",
        ({ boardId }) => ({
          boardId,
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
    plannedStart: {
      propDefinition: [
        planview_leankit,
        "plannedStart",
      ],
      optional: true,
    },
    plannedFinish: {
      propDefinition: [
        planview_leankit,
        "plannedFinish",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        planview_leankit,
        "tags",
        ({ boardId }) => ({
          boardId,
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
    customFields: {
      propDefinition: [
        planview_leankit,
        "customFields",
      ],
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
      connectionsParent,
      connectionsChild,
      customFields,
      ...data
    } = this;
    const customFieldsArray = [];

    if (customFields) {
      Object.entries(customFields).map((k) => (
        customFieldsArray.push({
          fieldId: k[0],
          value: k[1],
        })));
    }
    const response = await planview_leankit.createTask({
      $,
      cardId,
      data: {
        connections: {
          parents: connectionsParent,
          children: connectionsChild,
        },
        customFields: customFieldsArray,
        ...data,
      },
    });

    $.export("$summary", `A new task with id ${response.id} was successfully created!`);
    return response;
  },
};
