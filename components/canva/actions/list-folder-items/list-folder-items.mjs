// x-pd-ai: optimized
import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "canva-list-folder-items",
  name: "List Folder Items",
  description: "List items (designs, assets/images, sub-folders, brand templates) inside a folder via GET /folders/{folderId}/items, with pagination. An empty items array is valid for an empty folder. [See the documentation](https://www.canva.dev/docs/connect/api-reference/folders/list-folder-items/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    folderId: {
      propDefinition: [
        canva,
        "folderId",
      ],
    },
    itemTypes: {
      type: "string[]",
      label: "Item Types",
      description: "Filter by item type. Valid values: `design`, `folder`, `image`, `brand_template`.",
      optional: true,
      options: constants.FOLDER_ITEM_TYPE_OPTIONS,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort order. Valid values: `modified_descending`, `modified_ascending`, `created_descending`, `created_ascending`, `title_ascending`, `title_descending`.",
      optional: true,
      options: constants.FOLDER_ITEM_SORT_BY_OPTIONS,
    },
    pinStatus: {
      type: "string",
      label: "Pin Status",
      description: "Filter by pin status. Valid values: `any`, `pinned`.",
      optional: true,
      options: constants.PIN_STATUS_OPTIONS,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Max number of items to return per page. Between 1 and 100 (Canva API cap).",
      optional: true,
      min: 1,
      max: 100,
    },
    continuation: {
      type: "string",
      label: "Continuation",
      description: "Continuation token from a previous response, to fetch the next page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.canva.listFolderItems({
      $,
      folderId: this.folderId,
      params: {
        item_types: this.itemTypes?.length
          ? this.itemTypes.join(",")
          : undefined,
        sort_by: this.sortBy,
        pin_status: this.pinStatus,
        limit: this.limit,
        continuation: this.continuation,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.items?.length ?? 0} item(s) from folder "${this.folderId}"`);
    return response;
  },
};
