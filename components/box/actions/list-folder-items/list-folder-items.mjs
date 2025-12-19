import app from "../../box.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "box-list-folder-items",
  name: "List Folder Items",
  description: "Retrieves a list of items (files, folders, and web links) in a folder. [See the documentation](https://developer.box.com/reference/get-folders-id-items/).",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder to list items from. Use `0` for the root folder.",
      optional: false,
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "A comma-separated list of attributes to include in the response (e.g. `id,type,name,size,created_at`). [See available fields](https://developer.box.com/reference/get-folders-id-items/#param-fields).",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Defines the attribute by which items are sorted",
      optional: true,
      options: [
        {
          label: "ID",
          value: "id",
        },
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Date",
          value: "date",
        },
        {
          label: "Size",
          value: "size",
        },
      ],
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "The direction to sort results in",
      optional: true,
      options: [
        {
          label: "Ascending",
          value: "ASC",
        },
        {
          label: "Descending",
          value: "DESC",
        },
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items to return per page (max 1000)",
      optional: true,
      default: 100,
      max: 1000,
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit || constants.pageSize,
      usemarker: true,
    };

    if (this.fields?.length) {
      params.fields = Array.isArray(this.fields)
        ? this.fields.join(",")
        : this.fields;
    }
    if (this.sort) {
      params.sort = this.sort;
    }
    if (this.direction) {
      params.direction = this.direction;
    }

    const response = await this.app.getItems({
      $,
      folderId: this.folderId,
      params,
    });

    const itemCount = response.entries?.length || 0;
    $.export("$summary", `Retrieved ${itemCount} item${itemCount === 1
      ? ""
      : "s"} from folder`);

    return response;
  },
};
