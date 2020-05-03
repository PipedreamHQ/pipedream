const PIPEDREAM_BASE_URL = "https://api.pipedream.com/v1";
const PIPEDREAM_SQL_BASE_URL = "https://rt.pipedream.com/sql";

// Pipedream app
module.exports = {
  type: "app",
  app: "pipedream",
  methods: {
    async runSQLQuery(query) {
      try {
        const { data } = await axios({
          url: PIPEDREAM_SQL_BASE_URL,
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.$auth.api_key}`,
          },
          data: { query },
        });
        // TODO: massage query results to get header / results cleanly
        // TODO: return a link to the CSV in the emit body
        return data;
      } catch (err) {
        console.log(`Error in SQL query: ${err}`);
        throw err;
      }
    },
  },
};
