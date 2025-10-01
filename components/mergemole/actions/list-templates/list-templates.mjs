import mergemole from "../../mergemole.app.mjs";

export default {
  key: "mergemole-list-templates",
  name: "List Templates",
  description: "Retrieve a list of all templates under your account. [See the documentation](https://documenter.getpostman.com/view/41321603/2sB2j3AWqz#f75d7ffa-df2e-42ca-ad32-1db280acb9e2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mergemole,
    search: {
      type: "string",
      label: "Search",
      description: "Search templates by name",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mergemole.listTemplates({
      $,
      data: {
        search: this.search,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} template${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
