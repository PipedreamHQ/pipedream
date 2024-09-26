import { ConfigurationError } from "./errors";
import { JsonPrimitive } from "type-fest";
import { ExecuteQueryArgs } from "./sql";

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

export type SqlProp = {
  query: string;
  params?: string[];
};

export default {
  methods: {
    /**
     * A method that transforms the value of a prop of type `sql` so that it can
     * be fed to the `executeQuery` method.
     *
     * @param sqlProp - The prop of type `sql`
     * @returns The arguments to be passed to `executeQuery`
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeQueryAdapter(sqlProp: SqlProp): ExecuteQueryArgs {
      throw new ConfigurationError("executeQueryAdapter not implemented");
    },

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
