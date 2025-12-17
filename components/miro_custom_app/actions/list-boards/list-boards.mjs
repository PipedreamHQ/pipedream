import app from "../../miro_custom_app.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "List Boards",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "miro_custom_app-list-boards",
  description: "Returns a user's Miro boards. [See the docs](https://developers.miro.com/reference/get-boards).",
  type: "action",
  props: {
    app,
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
  },
  async run({ $: step }) {
    const response = await this.app.listBoards({
      step,
      params: {
        team_id: this.teamId,
        limit: constants.DEFAULT_LIMIT,
      },
    });

    step.export("$summary", `Successfully got ${utils.summaryEnd(response.data.length, "board")}`);

    return response.data;
  },
};
