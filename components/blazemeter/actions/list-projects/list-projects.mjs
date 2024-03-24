import blazemeter from "../../blazemeter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "blazemeter-list-projects",
  name: "List Projects",
  description: "List projects from a specified workspace in BlazeMeter. [See the documentation](https://api.blazemeter.com/functional/#projects-list)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blazemeter,
    workspaceId: {
      propDefinition: [
        blazemeter,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blazemeter.listProjects({
      workspaceId: this.workspaceId,
    });
    $.export("$summary", `Successfully listed projects in workspace ${this.workspaceId}`);
    return response;
  },
};
