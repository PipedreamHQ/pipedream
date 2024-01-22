import app from "../../northflank.app.mjs";

export default {
  key: "northflank-get-projects",
  name: "Get Projects",
  description: "Lists all projects with pagination. [See the documentation](https://northflank.com/docs/v1/api/projects/list-projects)",
  version: "0.0.6",
  type: "action",
  props: {
    app,
    perPage: {
      propDefinition: [
        app,
        "perPage",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listProjects({
      $,
      data: {
        per_page: this.perPage,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved the list of projects");
    return response;
  },
};
