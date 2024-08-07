import app from "../../jooto.app.mjs";

export default {
  key: "jooto-get-projects",
  name: "Get Projects",
  description: "Get a list of projects in your organization. [See the documentation](https://www.jooto.com/api/reference/request/#/default/get-projects)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getProjects({
      $,
    });

    $.export("$summary", `Successfully retrieved '${response.boards.length}' projects`);

    return response;
  },
};
