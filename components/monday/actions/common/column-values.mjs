import monday from "../../monday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
  },
  methods: {
    async getColumns(boardId) {
      const columns = await this.monday.listColumns({
        boardId: +boardId,
      });
      if (!columns) {
        throw new ConfigurationError(`No columns found for board ${boardId}`);
      }
      return columns.filter(({ id }) => id !== "name");
    },
    formatColumnValues(items) {
      for (const item of items) {
        item.column_values = item.column_values.map(({
          id, value, text,
        }) => ({
          id,
          value: text || value,
        }));
      }
      return items;
    },
  },
};
