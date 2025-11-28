import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-folder-articles",
  name: "List Folder Articles",
  description: "List folder articles in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#solution_article_attributes)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    categoryId: {
      propDefinition: [
        freshdesk,
        "categoryId",
      ],
    },
    folderId: {
      propDefinition: [
        freshdesk,
        "folderId",
        (c) => ({
          categoryId: c.categoryId,
        }),
      ],
    },
    maxResults: {
      propDefinition: [
        freshdesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.freshdesk.getPaginatedResources({
      fn: this.freshdesk.listFolderArticles,
      args: {
        $,
        folderId: this.folderId,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully listed ${results.length} solution article${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
