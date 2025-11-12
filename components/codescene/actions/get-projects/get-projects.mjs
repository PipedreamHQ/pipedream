import codescene from "../../codescene.app.mjs";

export default {
  key: "codescene-get-projects",
  name: "Get Projects",
  description: "Returns a list of projects. [See the documentation](https://codescene.io/docs/integrations/public-api.html#projects-list)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    codescene,
  },
  async run({ $ }) {
    const response = await this.codescene.listProjects({
      $,
    });

    $.export("$summary", "Successfully retrieved the list of projects");

    return response;
  },
};
