import {
  axios,
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import { parseColumnValues } from "../../common/utils.mjs";
import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-update-column-values",
  name: "Update Column Values",
  description: "Set one or more column values on an existing item. Use for any field change except the item's name — this mutation cannot change it, so use **Update Item Name** for that. Set `Board ID`, `Item ID` and `Column Values` as column ID to value pairs; call **List Columns** first for the column IDs and the labels a `status`/`dropdown` column accepts. Example: Column Values `{ \"status\": \"Done\", \"date4\": \"2026-09-02\", \"numbers\": 42 }`. A `file` column takes a file URL or a path under `/tmp` and is uploaded in a separate request. Every column ID is checked against the board before anything is sent, so a call that names an unknown column fails without changing the item. Returns the updated item with its `column_values`. [See the documentation](https://developer.monday.com/api-reference/reference/columns#change-multiple-column-values)",
  version: "0.2.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    updateInfoBox: {
      type: "alert",
      alertType: "info",
      content: "See the [Column types reference](https://developer.monday.com/api-reference/reference/column-types-reference) to find the proper data structures for supported column types",
    },
    itemId: {
      propDefinition: [
        common.props.monday,
        "itemId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
      optional: false,
    },
    columnValues: {
      propDefinition: [
        common.props.monday,
        "columnValues",
      ],
      optional: false,
      description: "The column values to set, as column ID → value pairs. Example: `{ \"status\": \"Done\", \"date4\": \"2026-09-02\", \"numbers\": 42 }`. Use **List Columns** to discover column IDs and the allowed labels for `status`/`dropdown` columns. For a `file` column, pass either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`) and the file is uploaded to that column. The item's name cannot be changed here — use **Update Item Name** instead. See the [Column types reference](https://developer.monday.com/api-reference/reference/column-types-reference) for the value each column type expects",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async uploadFile({
      $, itemId, column, filePath,
    }) {
      const query = `mutation ($file: File!) { add_file_to_column (file: $file, item_id: ${itemId}, column_id: "${column.id}") { id } }`;
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(filePath);

      const formData = new FormData();
      formData.append("query", query);
      formData.append("variables[file]", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      return axios($, {
        method: "POST",
        url: "https://api.monday.com/v2/file",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          "Authorization": this.monday.$auth.api_key,
        },
        data: formData,
      });
    },
  },
  async run({ $ }) {
    const values = parseColumnValues(this.columnValues);
    if (!values) {
      throw new ConfigurationError("Set at least one column value to update.");
    }

    // `getColumns` excludes the `name` column, which this mutation cannot change.
    const columns = await this.getColumns(this.boardId);
    const columnsById = new Map(columns.map((column) => [
      column.id,
      column,
    ]));
    const entries = Object.entries(values);
    for (const [
      id,
    ] of entries) {
      if (!columnsById.has(id)) {
        throw new ConfigurationError(`Column \`${id}\` was not found on board ${this.boardId}. Use the **List Columns** action to see the available column IDs.`);
      }
    }

    const columnValues = {};
    for (const [
      id,
      value,
    ] of entries) {
      const column = columnsById.get(id);
      if (column.type === "file") {
        await this.uploadFile({
          $,
          itemId: this.itemId,
          column,
          filePath: value,
        });
        continue;
      }
      columnValues[id] = value;
    }

    const response = await this.monday.updateColumnValues({
      boardId: +this.boardId,
      itemId: +this.itemId,
      columnValues: JSON.stringify(columnValues),
    });

    if (response.errors) {
      throw new ConfigurationError(JSON.stringify(response.errors[0]));
    }

    if (response.error_message) {
      throw new Error(`${response.error_message} ${JSON.stringify(response.error_data)}`);
    }

    const { data: { change_multiple_column_values: item } } = response;

    $.export("$summary", `Successfully updated item with ID ${item.id}.`);

    return this.formatColumnValues([
      item,
    ]);
  },
};
