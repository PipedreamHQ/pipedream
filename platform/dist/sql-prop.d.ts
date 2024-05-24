import { JsonPrimitive } from "type-fest";
export declare type ColumnSchema = {
    columnDefault: JsonPrimitive;
    dataType: string;
    isNullable: boolean;
    tableSchema?: string;
};
export declare type TableMetadata = {
    rowCount?: number;
};
export declare type TableSchema = {
    [columnName: string]: ColumnSchema;
};
export declare type TableInfo = {
    metadata: TableMetadata;
    schema: TableSchema;
};
export declare type DbInfo = {
    [tableName: string]: TableInfo;
};
declare const _default: {
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
        getSchema(): DbInfo;
    };
};
export default _default;
