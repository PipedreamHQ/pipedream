import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-find-or-create-card",
  name: "Find OR Create Card",
  version: "0.0.1",
  description: "Find or create a new card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/list)",
  type: "action",
  props: {
    planview_leankit,
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
    },
    title: {
      propDefinition: [
        planview_leankit,
        "title",
      ],
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
    customId: {
      propDefinition: [
        planview_leankit,
        "customId",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        planview_leankit,
        "typeId",
        ({ boardId }) => ({
          boardId,
        }),
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
    laneClassTypes: {
      propDefinition: [
        planview_leankit,
        "laneClassTypes",
      ],
      optional: true,
    },
    since: {
      propDefinition: [
        planview_leankit,
        "since",
      ],
      optional: true,
    },
    deleted: {
      propDefinition: [
        planview_leankit,
        "deleted",
      ],
      optional: true,
    },
    only: {
      propDefinition: [
        planview_leankit,
        "only",
      ],
      optional: true,
    },
    omit: {
      propDefinition: [
        planview_leankit,
        "omit",
      ],
      optional: true,
    },
    sort: {
      propDefinition: [
        planview_leankit,
        "sort",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      title,
      laneClassTypes,
      since,
      deleted,
      only,
      omit,
      sort,
      ...params
    } = this;

    let response = await planview_leankit.listCards({
      $,
      params: {
        search: title,
        since,
        deleted,
        only,
        omit,
        sort,
        laneClassTypes,
        ...params,
      },
    });
    let summary = "Card was successfully fetched!";

    if (!response.cards.length) {
      response = await planview_leankit.createCard({
        $,
        data: {
          title,
          customId: title,
          ...params,
        },
      });
      summary = "Card was successfully created!";
    }

    $.export("$summary", summary);
    return response;
  },
};
