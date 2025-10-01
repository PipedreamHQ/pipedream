import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-list-categories",
  name: "List Categories",
  description: "Retrieve a list of all categories in your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/hKlKgQuQgs-getting-categories)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpdocs,
  },
  async run({ $ }) {
    const { categories } = await this.helpdocs.listCategories({
      $,
    });

    $.export("$summary", `Found ${categories.length} categories`);
    return categories;
  },
};
