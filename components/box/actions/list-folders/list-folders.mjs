import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "box-list-folders",
  name: "List Folders",
  description: "Lists the subfolders directly inside a Box folder. Use `0` for the root folder. Returns one page of results (default 100, max 1000). Use **List Folder Items** instead to also include files and web links. [See the documentation](https://developer.box.com/reference/get-folders-id-items/).",
  version: "0.0.2",
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
      description: "The folder to list subfolders from. Use `0` for the root folder.",
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
      description: "Defines the attribute by which items are sorted. Valid values: `id`, `name`, `date`, `size` (e.g. `name`). Not supported for the root folder (`0`) — Box does not allow sorting root-folder results with marker-based pagination.",
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
      description: "The direction to sort results in. Valid values: `ASC` (ascending) or `DESC` (descending) (e.g. `ASC`).",
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
      description: "The maximum number of folders to return per page (max 1000)",
    },
    marker: {
      type: "string",
      label: "Marker",
      description: "The position marker at which to begin returning results. Pass the `next_marker` value returned by a previous run of this action to continue listing beyond the first page, e.g. `JV9IRGZmieiBasejOG9yDCRNgd2ymoZIbjsxbJMjIs3kioVii`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.sort && String(this.folderId) === "0") {
      throw new ConfigurationError("Box does not support `Sort` on the root folder (`0`). Remove Sort, or choose a non-root folder.");
    }

    const params = {
      limit: this.limit,
      usemarker: true,
      fields: utils.getFieldsParam(this.fields),
    };

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

    const folders = response.entries?.filter(({ type }) => type === "folder") ?? [];

    $.export("$summary", `Retrieved ${folders.length} folder${folders.length === 1
      ? ""
      : "s"} from folder`);

    return {
      ...response,
      entries: folders,
    };
  },
};
