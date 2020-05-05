// Pipedream API app file
const axios = require("axios");
const { convertArrayToCSV } = require("convert-array-to-csv");

const PIPEDREAM_BASE_URL = "https://api.pipedream.com/v1";
const PIPEDREAM_SQL_BASE_URL = "https://rt.pipedream.com/sql";

module.exports = {
  type: "app",
  app: "pipedream",
  methods: {
    // Runs a query againt the Pipedream SQL service
    // https://docs.pipedream.com/destinations/sql/
    async runSQLQuery(query, format) {
      const { data } = await axios({
        url: PIPEDREAM_SQL_BASE_URL,
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        data: { query },
      });

      const { error, queryExecutionId, resultSet, resultsFilename } = data;

      if (error && error.toDisplay) {
        throw new Error(error.toDisplay);
      }

      // Parse raw results
      const results = {
        columnInfo: resultSet.ResultSetMetadata.ColumnInfo,
        queryExecutionId,
        csvLocation: `https://rt.pipedream.com/sql/csv/${resultsFilename}`,
      };

      let formattedResults = [];

      // We can return results as an object, CSV, or array (default)
      if (format === "object") {
        // The SQL service returns headers as the first row of results
        let headers = resultSet.Rows.shift();
        for (const row of resultSet.Rows) {
          let obj = {};
          for (let j = 0; j < row.Data.length; j++) {
            // Column name : row value
            obj[headers.Data[j].VarCharValue] = row.Data[j].VarCharValue;
          }
          formattedResults.push(obj);
        }
      } else {
        for (const row of resultSet.Rows) {
          formattedResults.push(row.Data.map((data) => data.VarCharValue));
        }
      }

      if (format === "csv") {
        formattedResults = convertArrayToCSV(formattedResults);
      }

      results.results = formattedResults;

      return results;
    },
  },
};
