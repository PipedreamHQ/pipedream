import app from "../../miro_custom_app.app.mjs";

export default {
  props: {
    app,
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
    boardId: {
      propDefinition: [
        app,
        "boardId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
  },
};
