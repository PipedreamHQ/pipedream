import googleCloud from "../../google_cloud.app.mjs";

export default {
  key: "google_cloud-create-scheduled-query",
  name: "Create Scheduled Query",
  description: "Creates a scheduled query in Google Cloud. [See the documentation](https://cloud.google.com/bigquery/docs/scheduling-queries)",
  version: "0.0.1",
  type: "action",
  props: {
    googleCloud,
    destinationDatasetId: {
      label: "Destination Dataset",
      description: "The name of the dataset to create the table in. If the dataset does not exist, it will be created.",
      propDefinition: [
        googleCloud,
        "datasetId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The user-friendly display name for the transfer config.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The GoogleSQL query to execute. Eg. ``SELECT @run_time AS time, * FROM `bigquery-public-data.samples.shakespeare` LIMIT 1000``. [See the documentation here](https://cloud.google.com/bigquery/docs/scheduling-queries#query_string).",
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "Data transfer schedule. If the data source does not support a custom schedule, this should be empty. If it is empty, the default value for the data source will be used. The specified times are in UTC. Examples of valid format: `1st,3rd monday of month 15:30`, `every wed,fri of jan,jun 13:15`, and `first sunday of quarter 00:00`. [See more explanation about the format here](https://cloud.google.com/appengine/docs/flexible/python/scheduling-jobs-with-cron-yaml#the_schedule_format).",
    },
    writeDisposition: {
      type: "string",
      label: "Write Disposition",
      description: "The write preference you select determines how your query results are written to an existing destination table. [See the documentation here](https://cloud.google.com/bigquery/docs/scheduling-queries#write_preference).",
      options: [
        "WRITE_TRUNCATE",
        "WRITE_APPEND",
      ],
    },
  },
  methods: {
    createTransferConfig(transferConfig = {}) {
      const { googleCloud } = this;
      const {
        project_id: projectId,
        client_email: serviceAccountName,
      } = googleCloud.authKeyJson();

      const client = googleCloud.bigQueryDataTransferClient();
      const parent = client.projectPath(projectId);

      return client.createTransferConfig({
        serviceAccountName,
        parent,
        transferConfig,
      });
    },
  },
  async run({ $ }) {
    const {
      createTransferConfig,
      destinationDatasetId,
      displayName,
      query,
      schedule,
      writeDisposition,
    } = this;

    const response = await createTransferConfig({
      schedule,
      destinationDatasetId,
      displayName,
      params: {
        query,
        write_disposition: writeDisposition,
      },
    });

    $.export("$summary", `Scheduled query created with name: ${response.name}`);

    return response;
  },
};
