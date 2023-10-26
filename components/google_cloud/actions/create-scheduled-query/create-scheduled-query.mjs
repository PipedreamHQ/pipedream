import google_cloud from "../../google_cloud.app.mjs";

export default {
  key: "google_cloud-create-scheduled-query",
  name: "Create Scheduled Query",
  description: "Creates a scheduled query in Google Cloud. [See the documentation](https://cloud.google.com/bigquery/docs/scheduling-queries)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    google_cloud,
    datasetId: {
      propDefinition: [
        google_cloud,
        "datasetId",
      ],
    },
    queryString: {
      propDefinition: [
        google_cloud,
        "queryString",
      ],
    },
    schedule: {
      propDefinition: [
        google_cloud,
        "schedule",
      ],
    },
    destinationTable: {
      type: "string",
      label: "Destination Table",
      description: "The name of the table to save the query results.",
    },
  },
  async run({ $ }) {
    const parent = `projects/${this.google_cloud.sdkParams().projectId}/locations/us`;
    const transferConfig = {
      destinationDatasetId: this.datasetId,
      displayName: "Scheduled Query",
      dataSourceId: "scheduled_query",
      params: {
        query: this.queryString,
        destination_table_name_template: this.destinationTable,
        write_disposition: "WRITE_TRUNCATE",
      },
      schedule: this.schedule,
    };
    const response = await this.google_cloud.createTransferConfig(parent, transferConfig, "");
    $.export("$summary", `Scheduled query created with ID: ${response.name}`);
    return response;
  },
};
