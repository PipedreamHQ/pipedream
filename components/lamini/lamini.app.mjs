import fs from "fs";
import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "lamini",
  propDefinitions: {
    modelName: {
      type: "string",
      label: "Model Name",
      description: "The name of the model to use",
      async options({ includeFineTunedModels = true }) {
        const models = await this.listDownloadedModels();
        const hfModels = models.map(({ model_name: modelName }) => modelName);

        if (!includeFineTunedModels) {
          return hfModels;
        }

        const jobs = await this.listTrainedJobs();
        const tunedModels = jobs.filter(({ status }) => status === "COMPLETED")
          .map(({
            custom_model_name: label,
            model_name: value,
          }) => ({
            label,
            value,
          }));

        return hfModels.concat(tunedModels);
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the fine-tuning job to use.",
      async options({ filter = () => true }) {
        const jobs = await this.listTrainedJobs();
        return jobs
          .filter(filter)
          .map(({
            custom_model_name: label,
            job_id: value,
          }) => ({
            value,
            label,
          }));
      },
    },
    outputType: {
      type: "object",
      label: "Output Type",
      description: "Output type specification for structured outputs. Eg. `{ answer: \"str\" }`.",
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of tokens to generate.",
      optional: true,
    },
    maxNewTokens: {
      type: "integer",
      label: "Max New Tokens",
      description: "The maximum number of new tokens to generate.",
      optional: true,
    },
  },
  methods: {
    getUrl(path, versionPath = constants.VERSION_PATH.V1) {
      return `${constants.BASE_URL}${versionPath}${path}`;
    },
    getHeaders(headers) {
      if (headers?.noHeaders) {
        return;
      }
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async makeRequest({
      $ = this, path, url, versionPath, headers, ...args
    } = {}) {
      try {
        return await axios($, {
          ...args,
          url: url || this.getUrl(path, versionPath),
          headers: this.getHeaders(headers),
        });

      } catch (error) {
        if (error.status === 424 && error.data === "") {
          console.log("API is not ready yet. Retrying...", error);
          throw new ConfigurationError("The API is not ready yet. Please try again later.");
        }
        throw error;
      }
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    completions(args = {}) {
      return this.post({
        versionPath: constants.VERSION_PATH.V2,
        path: "/completions",
        ...args,
      });
    },
    listDownloadedModels(args = {}) {
      return this.makeRequest({
        versionPath: constants.VERSION_PATH.V1ALPHA,
        path: "/downloaded_models",
        ...args,
      });
    },
    listTrainedJobs(args = {}) {
      return this.makeRequest({
        path: "/train/jobs",
        ...args,
      });
    },
    getJobStatus({
      jobId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/train/jobs/${jobId}`,
        ...args,
      });
    },
    getUploadBasePath(args = {}) {
      return this.makeRequest({
        path: "/get-upload-base-path",
        ...args,
      });
    },
    getExistingDataset(args = {}) {
      return this.post({
        path: "/existing-data",
        ...args,
      });
    },
    async downloadFileToTmp({
      $, url,
    }) {
      const fileName = url.split("/").pop();

      const resp = await this.makeRequest({
        $,
        url,
        responseType: "arraybuffer",
        headers: {
          noHeaders: true,
        },
      });
      const rawcontent = resp.toString("base64");
      const buffer = Buffer.from(rawcontent, "base64");
      const filePath = `/tmp/${fileName}`;

      fs.writeFileSync(filePath, buffer);

      return {
        fileName,
        filePath,
      };
    },
  },
};
