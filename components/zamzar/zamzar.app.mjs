import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "zamzar",
  propDefinitions: {
    sourceFile: {
      type: "string",
      label: "Source File",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    targetFormat: {
      type: "string",
      label: "Target Format",
      description: "The desired output format for the conversion",
      options(args) {
        return this.getResourcesOptions({
          listResourcesFn: this.listFormats,
          mapResourceFn: ({ name }) => name,
          ...args,
        });
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The unique identifier of the job",
      options(args) {
        return this.getResourcesOptions({
          listResourcesFn: this.listJobs,
          ...args,
        });
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuth() {
      return {
        username: this.$auth.api_key,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, headers, data: rawData, ...args
    } = {}) {
      const {
        getUrl,
        getAuth,
      } = this;

      const contentType = constants.CONTENT_TYPE_KEY_HEADER;
      const hasMultipartHeader = utils.hasMultipartHeader(headers);
      const data = hasMultipartHeader && utils.getFormData(rawData) || rawData;

      const config = {
        ...args,
        debug: true,
        url: getUrl(path),
        auth: getAuth(),
        headers: hasMultipartHeader
          ? {
            ...headers,
            [contentType]: data.getHeaders()[contentType.toLowerCase()],
          }
          : headers,
        data,
      };

      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    retrieveJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    listFormats(args = {}) {
      return this._makeRequest({
        path: "/formats",
        ...args,
      });
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...args,
      });
    },
    listFiles(args = {}) {
      return this._makeRequest({
        path: "/files",
        ...args,
      });
    },
    async getResourcesOptions({
      prevContext, listResourcesFn, mapResourceFn = ({ id }) => String(id),
    } = {}) {
      const {
        hasMore,
        before,
      } = prevContext;

      if (hasMore === false) {
        return [];
      }

      const {
        data,
        paging: {
          total_count: totalCount,
          first,
        },
      } = await listResourcesFn({
        params: {
          before,
          limit: constants.DEFAULT_LIMIT,
        },
      });

      const options = data.map(mapResourceFn);

      return {
        options,
        context: {
          before: first,
          hasMore: data.length && totalCount > data.length,
        },
      };
    },
    async *getIterations({
      listResourcesFn, listResourcesFnArgs, resourcesFilter = () => true,
      max = constants.DEFAULT_MAX,
    }) {
      let before;
      let resourcesCount = 0;

      while (true) {
        const {
          data: nextResources,
          paging,
        } =
          await listResourcesFn({
            ...listResourcesFnArgs,
            params: {
              ...listResourcesFnArgs?.params,
              limit: constants.DEFAULT_LIMIT,
              before: before || listResourcesFnArgs?.params?.before,
            },
          });

        if (!nextResources?.length) {
          return console.log("No more resources found");
        }

        const resources = nextResources.filter(resourcesFilter);

        for (const resource of resources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return console.log("Max resources reached");
          }
        }

        before = paging?.first;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
