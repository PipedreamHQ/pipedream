import northflank from "../../northflank.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "northflank-get-projects",
  name: "Get Projects",
  description: "Lists all projects with pagination. [See the documentation](https://northflank.com/docs/v1/api/projects/list-projects)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    northflank,
    paginationPage: {
      propDefinition: [
        northflank,
        "paginationPage",
      ],
    },
  },
  async run({ $ }) {
    const projects = await this.northflank.listProjects({
      paginationPage: this.paginationPage,
    });

    $.export("$summary", "Successfully retrieved the list of projects");
    return projects;
  },
};
