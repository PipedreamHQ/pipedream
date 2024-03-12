import rollbarApp from "../../rollbar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rollbar-list-projects",
  name: "List Projects",
  description: "Lists all projects in Rollbar. [See the documentation](https://docs.rollbar.com/reference/list-all-projects)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rollbar: rollbarApp,
  },
  async run({ $ }) {
    const response = await this.rollbar.listProjects();
    $.export("$summary", "Successfully listed all projects");
    return response;
  },
};
