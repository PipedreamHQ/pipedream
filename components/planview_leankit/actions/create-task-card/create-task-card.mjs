import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-create-task-card",
  name: "Create Task Card",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a task card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/create-task)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
    },
    title: {
      propDefinition: [
        planviewLeankit,
        "title",
      ],
    },
    typeId: {
      propDefinition: [
        planviewLeankit,
        "typeId",
        ({ boardId }) => ({
          boardId,
          isTask: true,
        }),
      ],
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
    description: {
      propDefinition: [
        planviewLeankit,
        "description",
      ],
      optional: true,
    },
    size: {
      propDefinition: [
        planviewLeankit,
        "size",
      ],
      optional: true,
    },
    taskLaneId: {
      propDefinition: [
        planviewLeankit,
        "taskLaneId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      optional: true,
      withLabel: true,
    },
    connectionsParent: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
      label: "Parents Connections",
      type: "string[]",
      description: "The parents connections.",
      optional: true,
    },
    connectionsChild: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
      label: "Children Connections",
      type: "string[]",
      description: "The children connections.",
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
    priority: {
      propDefinition: [
        planviewLeankit,
        "priority",
      ],
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
    plannedStart: {
      propDefinition: [
        planviewLeankit,
        "plannedStart",
      ],
      optional: true,
    },
    plannedFinish: {
      propDefinition: [
        planviewLeankit,
        "plannedFinish",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        planviewLeankit,
        "tags",
        ({ boardId }) => ({
          boardId,
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
    customFields: {
      propDefinition: [
        planviewLeankit,
        "customFields",
      ],
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
      connectionsParent,
      connectionsChild,
      customFields,
      taskLaneId,
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

    let lane = "ready";
    if (taskLaneId) {
      const { lanes } = await planviewLeankit.listTaskboard({
        cardId,
      });

      const [
        firstLane,
      ] = lanes.filter((lane) => lane.name === taskLaneId.label);
      lane = firstLane.laneType;
    }

    const response = await planviewLeankit.createTask({
      $,
      cardId,
      data: {
        connections: {
          parents: connectionsParent,
          children: connectionsChild,
        },
        customFields: customFieldsArray,
        laneType: lane,
        ...data,
      },
    });

    $.export("$summary", `A new task with id ${response.id} was successfully created!`);
    return response;
  },
};
