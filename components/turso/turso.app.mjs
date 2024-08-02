import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "turso",
  propDefinitions: {
    organizationName: {
      type: "string",
      label: "Organization Name",
      description: "Name of the organization",
      async options() {
        const orgNames = await this.getOrganizations({});
        return orgNames.map(({ slug }) => ({
          value: slug,
        }));
      },
    },
    groupName: {
      type: "string",
      label: "Group Name",
      description: "Name of the group",
      async options({ organizationName }) {
        const response = await this.getGroups({
          organizationName,
        });
        const groupsNames = response.groups;
        return groupsNames.map(({ name }) => ({
          value: name,
        }));
      },
    },
    databaseName: {
      type: "string",
      label: "Database Name",
      description: "Name of the database",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.turso.tech/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    createDatabase({
      organizationName, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/organizations/${organizationName}/databases`,
        ...args,
      });
    },
    getDatabases({
      organizationName, ...args
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationName}/databases`,
        ...args,
      });
    },
    getGroups({
      organizationName, ...args
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationName}/groups`,
        ...args,
      });
    },
    getOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    /**
     * A helper method to get the schema of the database. Used by other features
     * (like the `sql` prop) to enrich the code editor and provide the user with
     * auto-complete and fields suggestion.
     *
     * @returns {DbInfo} The schema of the database, which is a
     * JSON-serializable object.
     */
    async getSchema() {
      const { rows } = await this.executeQuery({
        sql: `SELECT m.name AS tableName, ti.name AS columnName, ti.type AS dataType, ti.[notnull] AS isNullable, ti.[dflt_value] AS columnDefault 
              FROM sqlite_master AS m 
              JOIN pragma_table_info(m.name) AS ti 
              WHERE m.type = 'table' ORDER BY  m.name, ti.cid`,
      });
      const schema = {};
      for (const row of rows) {
        const { rows: count } = await this.executeQuery({
          sql: `SELECT COUNT (*) as count FROM ${row.tableName}`,
        });
        schema[row.tableName] = {
          metadata: {
            rowCount: count[0].count,
          },
          schema: {
            ...schema[row.tableName]?.schema,
            [row.columnName]: {
              columnDefault: row.columnDefault,
              dataType: row.dataType,
              isNullable: row.isNullable,
            },
          },
        };
      }
      return schema;
    },
    /**
     * A method that performs the inverse transformation of `proxyAdapter`.
     *
     * @param {object} proxyArgs - The output of `proxyAdapter`.
     * @param {string} proxyArgs.query - The SQL query to be executed.
     * @param {string[]} proxyArgs.params - The values to replace in the SQL
     * query.
     * @returns {object} - The adapted query and parameters, compatible with
     * `executeQuery`.
     */
    executeQueryAdapter(proxyArgs = {}) {
      let { query: sql } = proxyArgs;
      const params = proxyArgs?.params || [];
      for (const param of params) {
        sql = sql.replace("?", param);
      }
      sql = sql.replaceAll("\n", " ");
      return {
        sql,
      };
    },
    /**
     * Executes a query against the MySQL database. This method takes care of
     * connecting to the database, executing the query, and closing the
     * connection.
     * @param {object} preparedStatement - The prepared statement to be sent to the DB.
     * @param {string} preparedStatement.sql - The prepared SQL query to be executed.
     * @param {string[]} preparedStatement.values - The values to replace in the SQL query.
     * @returns {object[]} - The rows returned by the DB as a result of the query.
     */
    async executeQuery({
      sql, $ = this,
    }) {
      const {
        organization_slug: organizationName, database_name: databaseName, oauth_access_token: jwt,
      } = this.$auth;
      const { results } = await axios($, {
        method: "POST",
        url: `https://${databaseName}-${organizationName}.turso.io/v2/pipeline`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          requests: [
            {
              type: "execute",
              stmt: {
                sql,
              },
            },
            {
              type: "close",
            },
          ],
        },
      });
      if (results[0].type === "error") {
        throw new Error(`${results[0].error.message}`);
      }
      const {
        cols = [], rows = [], ...data
      } = results[0].response.result;

      // format response
      const response = [];
      const columnNames = cols.map(({ name }) => name);
      rows.forEach((row) => {
        const newRow = {};
        for (let i = 0; i < columnNames.length; i++) {
          newRow[columnNames[i]] = row[i].value;
        }
        response.push(newRow);
      });
      return {
        rows: response,
        ...data,
      };
    },
  },
};
