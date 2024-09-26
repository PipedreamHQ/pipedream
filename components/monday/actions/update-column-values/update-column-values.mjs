import common from "../common/column-values.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";
import FormData from "form-data";

export default {
  ...common,
  key: "monday-update-column-values",
  name: "Update Column Values",
  description: "Update multiple column values of an item. [See the documentation](https://developer.monday.com/api-reference/docs/columns#change-multiple-column-values)",
  version: "0.0.5",
  type: "action",
  props: {
    ...common.props,
    boardId: {
      ...common.props.boardId,
      description: "The board's unique identifier. See the [Column types reference](https://developer.monday.com/api-reference/docs/column-types-reference) to find the proper data structures for supported column types.",
      reloadProps: true,
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
  },
  async additionalProps() {
    const props = {};
    if (this.boardId) {
      const columns = await this.getColumns(this.boardId);
      for (const column of columns) {
        props[column.id] = {
          type: "string",
          label: column.title,
          description: `The value for column ${column.title}`,
          optional: true,
        };
        if (column.type === "file") {
          props[column.id].description += ". The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).";
        }
      }
    }
    return props;
  },
  methods: {
    ...common.methods,
    async uploadFile({
      $, itemId, column, filePath,
    }) {
      const query = `mutation ($file: File!) { add_file_to_column (file: $file, item_id: ${itemId}, column_id: "${column.id}") { id } }`;
      const content = fs.createReadStream(filePath.includes("tmp/")
        ? filePath
        : `/tmp/${filePath}`);

      const formData = new FormData();
      formData.append("query", query);
      formData.append("variables[file]", content);

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
    const columns = await this.getColumns(this.boardId);
    const columnValues = {};
    for (const column of columns) {
      if (this[column.id]) {
        if (column.type === "file") {
          await this.uploadFile({
            $,
            itemId: this.itemId,
            column,
            filePath: this[column.id],
          });
          continue;
        }
        columnValues[column.id] = this[column.id];
      }
    }

    const response = await this.monday.updateColumnValues({
      boardId: +this.boardId,
      itemId: +this.itemId,
      columnValues: JSON.stringify(columnValues),
    });

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
