import app from "../../parsehub.app.mjs";

export default {
  key: "parsehub-get-projects",
  name: "Get Projects",
  description: "Lists all projects in your account [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#list-all-projects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listProjects({
      $,
      params: {
        offset: this.offset,
        limit: this.limit,
      },
    });
    $.export("$summary", "Successfully listed your projects");
    return response;
  },
};
