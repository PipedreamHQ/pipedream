// x-pd-ai: optimized
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-project-boards",
  name: "List Project Boards",
  description: "Lists all active project boards. Run this first to obtain a valid board ID for **Create Project**, **Update Project**, and **List Project Phases**. [See the documentation](https://developers.pipedrive.com/docs/api/v1/ProjectBoards)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getProjectBoards({
      $,
    });
    $.export("$summary", `Successfully listed ${response.data?.length ?? 0} project boards`);
    return response;
  },
};
