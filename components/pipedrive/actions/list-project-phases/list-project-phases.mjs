// x-pd-ai: optimized
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-project-phases",
  name: "List Project Phases",
  description: "Lists the phases for a given board. Run **List Project Boards** first to obtain a board ID, then run this to obtain a valid phase ID for **Create Project** or **Update Project**. [See the documentation](https://developers.pipedrive.com/docs/api/v1/ProjectPhases#getProjectsPhases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board to list phases for (required by the API). Run **List Project Boards** first to obtain a valid board ID.",
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getProjectPhases({
      boardId: this.boardId,
      $,
    });
    $.export("$summary", `Successfully listed ${response.data?.length ?? 0} phases for board ${this.boardId}`);
    return response;
  },
};
