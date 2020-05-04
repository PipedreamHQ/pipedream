const axios = require("axios");

const PIPEDREAM_BASE_URL = "https://api.pipedream.com/v1";
const PIPEDREAM_SQL_BASE_URL = "https://rt.pipedream.com/sql";

// Pipedream app
module.exports = {
  type: "app",
  app: "pipedream",
  methods: {
    async runSQLQuery(query, format) {
      try {
        const { results } = (
          await axios({
            url: PIPEDREAM_SQL_BASE_URL,
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.$auth.api_key}`,
            },
            data: { query },
          })
        ).data;
        // TODO: massage query results to get header / results cleanly
        // TODO: return a link to the CSV in the emit body
        const { error, queryExecutionId, resultSet, resultsFilename } = results;
        if (error.toDisplay) {
          throw new Error(error.toDisplay);
        }

        // Parse raw results
        const data = {
          columnInfo: resultSet.ResultSetMetadata.ColumnInfo,
          queryExecutionId,
          csvLocation: `https://rt.pipedream.com/sql/csv/${resultsFilename}`,
        };

        let results = [];

        if (format === "object") {
          let headers = resultSet.Rows.shift();
          for (const row of resultSet.Rows.length) {
            let obj = {};
            for (let j = 0; j < row.Data.length; j++) {
              obj[headers.Data[j].VarCharValue] = row.Data[j].VarCharValue;
            }
            results.push(obj);
          }
        } else {
          for (const row of resultSet.Rows) {
            results.push(row.Data.map((data) => data.VarCharValue));
          }
        }

        if (format === "csv") {
          results = convertArrayToCSV(results);
        }

        data.results = results;
        this.$emit(data);
      } catch (err) {
        console.log(`Error in SQL query: ${err}`);
        throw err;
      }
    },
  },
};
