import { ConfigurationError } from "./errors";
import { JsonPrimitive } from "type-fest";

export type DbSchema = {
  [tableName: string]: {
    [columnName: string]: {
      columnDefault: JsonPrimitive;
      dataType: string;
      isNullable: boolean;
      tableSchema?: string;
    };
  };
};

export type RowCount = {
  [tableName: string]: {
    _rowCount?: number;
  };
};

export default {
  methods: {
    /**
     * A helper method to get the schema of the database. Used by other features
     * (like the `sql` prop) to enrich the code editor and provide the user with
     * auto-complete and fields suggestion.
     *
     * @returns {DbSchema} The schema of the database, which is a
     * JSON-serializable object.
     * @throws {ConfigurationError} If the method is not implemented.
     */
    getSchema(): DbSchema | RowCount {
      throw new ConfigurationError("getSchema not implemented");
    },
  },
};
