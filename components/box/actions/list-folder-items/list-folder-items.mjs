import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

const ROOT_FOLDER_ID = "0";
const MIN_OFFSET = 0;

export default {
  key: "box-list-folder-items",
  name: "List Folder Items",
  description: "Lists files, folders, and web links in a Box folder. Use `0` for the root folder. Returns one page of results (default 100, max 1000), with `next_marker` for paging, or `total_count` and `offset` when **Offset** is set or the root folder is sorted. To find items by name or metadata across all folders, use **Search Content** instead. [See the documentation](https://developer.box.com/reference/get-folders-id-items/).",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
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
      description: "Defines the attribute by which items are sorted, e.g. `name`. Sorting the root folder (`0`) switches to offset-based pagination, so page with **Offset** instead of **Marker**.",
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
      propDefinition: [
        app,
        "limit",
      ],
      description: "The maximum number of items to return per page (max 1000)",
    },
    marker: {
      type: "string",
      label: "Marker",
      description: "The position marker at which to begin returning results. Pass the `next_marker` value returned by a previous run of this action to continue listing beyond the first page, e.g. `JV9IRGZmieiBasejOG9yDCRNgd2ymoZIbjsxbJMjIs3kioVii`. Keep the same **Sort** and **Direction** across pages. Cannot be combined with **Offset** or with **Sort** on the root folder (`0`).",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The index of the first item to return, e.g. `100`. Switches to offset-based pagination, which is also used automatically when sorting the root folder (`0`). To get the next page, add **Limit** to the previous offset; stop when it reaches `total_count`. Box notes offset pagination may be unreliable at very high offsets. Cannot be combined with **Marker**.",
      optional: true,
      min: MIN_OFFSET,
    },
  },
  async run({ $ }) {
    // Box documents sort as unsupported with marker pagination on the root folder
    const isRootSort = this.sort && String(this.folderId) === ROOT_FOLDER_ID;
    const useOffset = Number.isInteger(this.offset) || isRootSort;
    if (useOffset && this.marker) {
      throw new ConfigurationError("`Marker` cannot be combined with `Offset` or with `Sort` on the root folder (`0`). Remove Marker and page with Offset instead.");
    }

    const params = {
      limit: this.limit,
      fields: utils.getFieldsParam(this.fields),
    };

    if (useOffset) {
      params.offset = this.offset;
    } else {
      params.usemarker = true;
    }

    if (this.sort) {
      params.sort = this.sort;
    }
    if (this.direction) {
      params.direction = this.direction;
    }
    if (this.marker) {
      params.marker = this.marker;
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
