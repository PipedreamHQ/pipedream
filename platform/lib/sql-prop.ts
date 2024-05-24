import { ConfigurationError } from "./errors";
import { JsonPrimitive } from "type-fest";

export type ColumnSchema = {
  columnDefault: JsonPrimitive;
  dataType: string;
  isNullable: boolean;
  tableSchema?: string;
};

export type TableMetadata = {
  rowCount?: number;
};

export type TableSchema = {
  [columnName: string]: ColumnSchema;
};

export type TableInfo = {
  metadata: TableMetadata;
  schema: TableSchema;
};

export type DbInfo = {
  [tableName: string]: TableInfo;
};

export default {
  methods: {
    /**
     * A helper method to get the schema of the database. Used by other features
     * (like the `sql` prop) to enrich the code editor and provide the user with
     * auto-complete and fields suggestion.
     *
     * @returns {DbInfo} The schema of the database, which is a
     * JSON-serializable object.
     * @throws {ConfigurationError} If the method is not implemented.
     */
    getSchema(): DbInfo {
      throw new ConfigurationError("getSchema not implemented");
    },
  },
};
