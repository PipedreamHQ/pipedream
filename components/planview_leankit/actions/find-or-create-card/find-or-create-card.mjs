import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-find-or-create-card",
  name: "Find OR Create Card",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or create a new card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/list)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    title: {
      propDefinition: [
        planviewLeankit,
        "title",
      ],
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
      title,
      laneClassTypes,
      since,
      deleted,
      only,
      omit,
      sort,
      ...params
    } = this;

    let response = await planviewLeankit.listCards({
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
    let summary = `${response.cards.length} ${response.cards.length === 1
      ? "card was"
      : "cards were"} successfully fetched!`;

    if (!response.cards.length) {
      response = await planviewLeankit.createCard({
        $,
        data: {
          title,
          customId: title,
          ...params,
        },
      });
      summary = `Card with id ${response.id} was successfully created!`;
    }

    $.export("$summary", summary);
    return response;
  },
};
