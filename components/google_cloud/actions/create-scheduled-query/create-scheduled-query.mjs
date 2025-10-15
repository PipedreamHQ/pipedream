import { protos } from "@google-cloud/bigquery-data-transfer";
import googleCloud from "../../google_cloud.app.mjs";
import constants from "../../common/constants.mjs";
import regions from "../../common/regions.mjs";

const {
  CreateTransferConfigRequest,
  TransferConfig,
} = protos.google.cloud.bigquery.datatransfer.v1;

export default {
  key: "google_cloud-create-scheduled-query",
  name: "Create Scheduled Query",
  description: "Creates a scheduled query in Google Cloud. [See the documentation](https://cloud.google.com/bigquery/docs/scheduling-queries)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    datasetRegion: {
      type: "string",
      label: "Dataset Region",
      description: "The geographic location where the dataset should reside. [See the documentation here](https://cloud.google.com/bigquery/docs/locations#specifying_your_location)",
      default: "us",
      options: regions,
      optional: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The user-friendly display name for the transfer config.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The GoogleSQL query to execute. Eg. ``SELECT @run_time AS time, * FROM `my_dataset.my_table` LIMIT 1000``. [See the documentation here](https://cloud.google.com/bigquery/docs/scheduling-queries#query_string).",
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "Data transfer schedule. If the data source does not support a custom schedule, this should be empty. If it is empty, the default value for the data source will be used. The specified times are in UTC. Examples of valid format: `every 24 hours`, `1st,3rd monday of month 15:30`, `every wed,fri of jan,jun 13:15`, and `first sunday of quarter 00:00`. [See more explanation about the format here](https://cloud.google.com/appengine/docs/flexible/python/scheduling-jobs-with-cron-yaml#the_schedule_format).",
      optional: true,
    },
    writeDisposition: {
      type: "string",
      label: "Write Disposition",
      description: "The write preference you select determines how your query results are written to an existing destination table. [See the documentation here](https://cloud.google.com/bigquery/docs/scheduling-queries#write_preference).",
      default: constants.WRITE_DISPOSITION.WRITE_TRUNCATE,
      options: Object.values(constants.WRITE_DISPOSITION),
      optional: true,
    },
    destinationTableNameTemplate: {
      type: "string",
      label: "Destination Table Name Template",
      description: "The destination table name template can contain template variables such as ``{run_date}`` or ``{run_time}``. [See the documentation here](https://cloud.google.com/bigquery/docs/scheduling-queries#templating-examples).",
      optional: true,
      default: "logs",
    },
  },
  methods: {
    getTransferConfig({
      query, writeDisposition, destinationTableNameTemplate, ...args
    } = {}) {
      return new TransferConfig({
        dataSourceId: constants.DATA_SOURCE_ID.SCHEDULED_QUERY,
        params: {
          fields: {
            query: {
              stringValue: query,
            },
            destination_table_name_template: {
              stringValue: destinationTableNameTemplate,
            },
            write_disposition: {
              stringValue: writeDisposition,
            },
          },
        },
        ...args,
      });
    },
    createTransferConfig(args = {}) {
      const {
        googleCloud,
        getTransferConfig,
      } = this;

      const {
        project_id: projectId,
        client_email: serviceAccountName,
      } = googleCloud.authKeyJson();

      const client = googleCloud.bigQueryDataTransferClient();
      const parent = client.projectPath(projectId);

      const request = new CreateTransferConfigRequest({
        parent,
        serviceAccountName,
        transferConfig: getTransferConfig(args),
      });

      return client.createTransferConfig(request);
    },
  },
  async run({ $ }) {
    const {
      createTransferConfig,
      ...props
    } = this;

    const [
      response,
    ] = await createTransferConfig(props);

    $.export("$summary", `Scheduled query created with name: \`${response.name}\``);

    return response;
  },
};
