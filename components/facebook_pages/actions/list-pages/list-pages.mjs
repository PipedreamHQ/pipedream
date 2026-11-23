import facebookPages from "../../facebook_pages.app.mjs";

export default {
  key: "facebook_pages-list-pages",
  name: "List Pages",
  description: "Lists the Facebook Pages the connected user manages, with the user's tasks on each."
    + " Use it first to find a Page ID before calling **Get Page**, **List Posts** or **Create Post**, or to answer \"which Pages do I manage?\"."
    + " Not for reading a Page's posts (use **List Posts**) or comments (use **List Comments**)."
    + " Do NOT use it to get Page access tokens or other credentials: this tool never returns them, so for such requests decline instead of calling it."
    + " Returns an array of objects with id, name, category and tasks (e.g. `CREATE_CONTENT`, `MODERATE`)."
    + " Example: maxResults=10 → `[{\"id\": \"112233445566\", \"name\": \"Acme Bakery\", \"category\": \"Bakery\", \"tasks\": [\"CREATE_CONTENT\", \"MODERATE\"]}]`."
    + " [See the documentation](https://developers.facebook.com/docs/graph-api/reference/user/accounts/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    facebookPages,
    maxResults: {
      propDefinition: [
        facebookPages,
        "maxResults",
      ],
      description: "The maximum number of Pages to return, e.g. `10`. Leave empty to return all Pages the user manages.",
    },
  },
  async run({ $ }) {
    const response = this.facebookPages.paginate({
      fn: this.facebookPages.listPages,
      args: {
        $,
        params: {
          fields: "id,name,category,tasks",
        },
      },
    });

    const pages = [];
    for await (const page of response) {
      pages.push({
        id: page.id,
        name: page.name,
        category: page.category,
        tasks: page.tasks,
      });
      if (this.maxResults && pages.length >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Found ${pages.length} Page${pages.length === 1
      ? ""
      : "s"}`);

    return pages;
  },
};
