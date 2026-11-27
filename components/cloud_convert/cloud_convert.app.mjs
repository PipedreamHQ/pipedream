import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloud_convert",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the input task for the conversion, normally the import task.",
      async options({
        page, filters,
        filter = () => true,
        mapper = ({
          id: value,
          result,
        }) => ({
          value,
          label: result?.files?.map(({ filename }) => filename).join(", ") || value,
        }),
      }) {
        const { data } = await this.listTasks({
          params: {
            ...filters,
            page: page + 1,
          },
        });
        return data.filter(filter).map(mapper);
      },
    },
    conversionType: {
      type: "string",
      label: "Converstion Type",
      description: "The ID of the operation to perform.",
      async options({
        page, filters,
        mapper = ({ id: value }) => value,
      }) {
        const { data } = await this.listOperations({
          params: {
            ...filters,
            page: page + 1,
          },
        });
        return data.map(mapper);
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job, e.g. `c677ccf7-8876-4f48-bb6f-566fe0ca0a4a`. Use the `data.id` returned by **Create Job** or **Create Merge Files To PDF Job**.",
      async options({ page }) {
        const { data } = await this.listJobs({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, tag, status,
        }) => ({
          value,
          label: `${tag || value} (${status})`,
        }));
      },
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "The properties to include in the response",
      optional: true,
      options: [
        "retries",
        "depends_on_tasks",
        "payload",
        "job",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename of the input file, including extension. If none provided we will try to detect the filename from the URL.",
      optional: true,
    },
  },
  methods: {
    getUrl(path, baseUrl = constants.BASE_URL) {
      return `${baseUrl}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, baseUrl, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, baseUrl),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    createJob(args = {}) {
      return this.post({
        path: "/jobs",
        ...args,
      });
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...args,
      });
    },
    getJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    // Synchronous endpoints block until the job/task is finished or has failed.
    waitForJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        baseUrl: constants.SYNC_BASE_URL,
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    waitForTask({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        baseUrl: constants.SYNC_BASE_URL,
        path: `/tasks/${taskId}`,
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    listOperations(args = {}) {
      return this._makeRequest({
        path: "/operations",
        ...args,
      });
    },
  },
};
