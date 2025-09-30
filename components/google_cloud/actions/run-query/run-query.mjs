import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Run Query",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-run-query",
  type: "action",
  description: "Runs a query in BigQuery. [See the documentation](https://cloud.google.com/bigquery/docs/running-queries#node.js) for more information.",
  props: {
    googleCloud,
    query: {
      type: "string",
      label: "Query",
      description: "The SQL query to run against the dataset.",
    },
    location: {
      type: "string",
      label: "Location",
      description: "Location must match that of the dataset(s) referenced in the query. Defaults to `US`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      query,
      location,
    } = this;

    const client = this.googleCloud.getBigQueryClient();

    try {
      const [
        job,
      ] = await client.createQueryJob({
        query,
        location,
      });

      const response = await job.getQueryResults();

      $.export("$summary", "Successfully ran query");

      return response;
    } catch (error) {
      console.log(JSON.stringify(error.errors, null, 2));
      throw error;
    }
  },
};
