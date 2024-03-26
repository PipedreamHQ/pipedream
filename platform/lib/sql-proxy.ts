import { ConfigurationError } from "./errors";

export type ClientConfiguration = object;
export type ProxyArgs = {
  query: string;
  params?: unknown[];
};
export type Row = object;

export default {
  methods: {
    /**
     * A helper method to get the configuration object that's directly fed to
     * the DB client constructor. Used by other features (like SQL proxy) to
     * initialize their client in an identical way.
     *
     * @returns {ClientConfiguration} - Configuration object for the DB client
     */
    getClientConfiguration(): ClientConfiguration {
      throw new ConfigurationError("getClientConfiguration not implemented");
    },

    /**
     * Executes a query against the database. This method takes care
     * of connecting to the database, executing the query, and closing the
     * connection.
     *
     * @param args The query string or object to be sent to the DB.
     * SQL query.
     * @returns {Row[]} - The rows returned by the DB as a result of the
     * query.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeQuery(...args: unknown[]): Row[] {
      throw new ConfigurationError("executeQuery not implemented");
    },

    /**
     * Adapts the arguments to `executeQuery` so that they can be consumed by
     * the SQL proxy (when applicable). Note that this method is not intended to
     * be used by the component directly.
     *
     * @param args The query string or object to be sent to the DB.
     * @returns {ProxyArgs} - The adapted query and parameters.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    proxyAdapter(...args: unknown[]): ProxyArgs {
      throw new ConfigurationError("proxyAdapter not implemented");
    },
  },
};
