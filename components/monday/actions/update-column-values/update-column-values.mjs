import {
  axios,
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import { getColumnOptions } from "../../common/utils.mjs";
import common from "../common/column-values.mjs";

export default {
  ...common,
  key: "monday-update-column-values",
  name: "Update Column Values",
  description: "Update multiple column values of an item. [See the documentation](https://developer.monday.com/api-reference/reference/columns#change-multiple-column-values)",
  version: "0.2.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    updateInfoBox: {
      type: "alert",
      alertType: "info",
      content: "See the [Column types reference](https://developer.monday.com/api-reference/reference/column-types-reference) to find the proper data structures for supported column types",
    },
    boardId: {
      ...common.props.boardId,
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { boardId } = this;
    if (boardId) {
      const columns = await this.monday.listColumns({
        boardId: +boardId,
      });
      for (const column of columns) {
        const id = column.id;
        props[id] = {
          type: "string",
          label: column.title,
          description: `The value for the "${column.title}" column (\`${id}\`)`,
          optional: true,
          options: getColumnOptions(columns, id),
        };
        if (column.type === "file") {
          props[column.id].description += ". Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)";
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
