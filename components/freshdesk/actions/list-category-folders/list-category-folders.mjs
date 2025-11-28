import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-category-folders",
  name: "List Category Folders",
  description: "List category folders in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#solution_folder_attributes)",
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
  },
  async run({ $ }) {
    const response = await this.freshdesk.listCategoryFolders({
      $,
      categoryId: this.categoryId,
    });
    $.export("$summary", `Successfully listed ${response.length} solution folder${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
