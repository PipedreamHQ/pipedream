import { ExecuteQueryArgs } from "./sql";
export declare type ClientConfiguration = object;
export declare type ProxyArgs = {
    query: string;
    params?: unknown[];
};
export declare type Row = object;
declare const _default: {
    methods: {
        /**
         * A helper method to get the configuration object that's directly fed to
         * the DB client constructor. Used by other features (like SQL proxy) to
         * initialize their client in an identical way.
         *
         * @returns The configuration object for the DB client
         */
        getClientConfiguration(): ClientConfiguration;
        /**
         * Executes a query against the database. This method takes care of
         * connecting to the database, executing the query, and closing the
         * connection.
         *
         * @param args - The query string or object to be sent to the DB. SQL query.
         * @returns The rows returned by the DB as a result of the query.
         */
        executeQuery(args: ExecuteQueryArgs): Row[];
        /**
         * Adapts the arguments to `executeQuery` so that they can be consumed by
         * the SQL proxy (when applicable). Note that this method is not intended to
         * be used by the component directly.
         *
         * @param args - The query string or object to be sent to the DB.
         * @returns The adapted query and parameters.
         */
        proxyAdapter(args: ExecuteQueryArgs): ProxyArgs;
    };
};
export default _default;
