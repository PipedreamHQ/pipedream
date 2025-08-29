import {
  ConfigurationError,
  getFileStream,
} from "@pipedream/platform";
import app from "../../salesforce_rest_api.app.mjs";

export default {
  props: {
    app,
    csvFilePath: {
      type: "string",
      label: "CSV File Path Or URL",
      description: "The path to the CSV file to process. Provide a path to a file in the `/tmp` directory (for example, `/tmp/data.csv`). If a URL is provided, the file will be downloaded to the `/tmp` directory. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/datafiles_prepare_data.htm)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  methods: {
    getObject() {
      throw new ConfigurationError("getObject method not implemented");
    },
    getOperation() {
      throw new ConfigurationError("getOperation method not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary method not implemented");
    },
    async processBulkOperation({
      object, operation, csvData, externalIdFieldName, ...args
    } = {}) {
      const { app } = this;
      const job = await app.createBulkJob({
        ...args,
        data: {
          object,
          operation,
          externalIdFieldName,
        },
      });

      await app.uploadBulkJobData({
        ...args,
        jobId: job.id,
        data: csvData,
      });

      await app.patchBulkJob({
        ...args,
        jobId: job.id,
        data: {
          state: "UploadComplete",
        },
      });

      return app.getBulkJobInfo({
        ...args,
        jobId: job.id,
      });
    },
  },
  async run({ $ }) {
    const {
      processBulkOperation,
      getObject,
      getOperation,
      getSummary,
      csvFilePath,
    } = this;

    const csvData = await getFileStream(csvFilePath);

    const result = await processBulkOperation({
      $,
      object: getObject(),
      operation: getOperation(),
      csvData,
    });

    $.export("$summary", getSummary());

    return result;
  },
};
