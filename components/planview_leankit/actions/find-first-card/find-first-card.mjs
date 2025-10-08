import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-find-first-card",
  name: "Find First Card",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find first matching card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/list)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
      optional: true,
    },
    laneId: {
      propDefinition: [
        planviewLeankit,
        "laneId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    search: {
      propDefinition: [
        planviewLeankit,
        "search",
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
    typeId: {
      propDefinition: [
        planviewLeankit,
        "typeId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    customIconId: {
      propDefinition: [
        planviewLeankit,
        "customIconId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      optional: true,
    },
    laneClassTypes: {
      propDefinition: [
        planviewLeankit,
        "laneClassTypes",
      ],
      optional: true,
    },
    since: {
      propDefinition: [
        planviewLeankit,
        "since",
      ],
      optional: true,
    },
    deleted: {
      propDefinition: [
        planviewLeankit,
        "deleted",
      ],
      optional: true,
    },
    only: {
      propDefinition: [
        planviewLeankit,
        "only",
      ],
      optional: true,
    },
    omit: {
      propDefinition: [
        planviewLeankit,
        "omit",
      ],
      optional: true,
    },
    sort: {
      propDefinition: [
        planviewLeankit,
        "sort",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      ...params
    } = this;

    const { cards } = await planviewLeankit.listCards({
      $,
      params,
    });

    $.export("$summary", `Card with id ${cards[0].id} was successfully fetched!`);
    return cards[0];
  },
};
