import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "tableau",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site ID",
      description: "The ID of the site where the project or event is located",
      async options() {
        const { session: { site } } = await this.getCurrentSession();
        return [
          {
            label: site.name,
            value: site.id,
          },
        ];
      },
    },
    parentProjectId: {
      type: "string",
      label: "Parent Project ID",
      description: "The ID of the parent project under which the new project will be created",
      optional: true,
      async options({
        siteId, page,
      }) {
        if (!siteId) {
          return [];
        }
        const { projects: { project: data } } =
          await this.listProjects({
            siteId,
            params: {
              pageSize: constants.DEFAULT_LIMIT,
              pageNumber: page + 1,
            },
          });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    workbookId: {
      type: "string",
      label: "Workbook ID",
      description: "The ID of the workbook to download as PDF",
      async options({
        siteId, page,
      }) {
        if (!siteId) {
          return [];
        }
        const { workbooks: { workbook: data } } =
          await this.listWorkbooks({
            siteId,
            params: {
              pageSize: constants.DEFAULT_LIMIT,
              pageNumber: page + 1,
            },
          });
        return data?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://${this.$auth.domain}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Tableau-Auth": this.$auth.oauth_access_token,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
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
    getCurrentSession(args = {}) {
      return this._makeRequest({
        path: "/sessions/current",
        ...args,
      });
    },
    listProjects({
      siteId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/projects`,
        ...args,
      });
    },
    listWorkbooks({
      siteId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/workbooks`,
        ...args,
      });
    },
    downloadWorkbookPdf({
      siteId, workbookId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/workbooks/${workbookId}/pdf`,
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let pageNumber = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              pageNumber,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        const totalAvailable = response.pagination?.totalAvailable;

        if (resourcesCount >= totalAvailable) {
          console.log("There are no more resources to fetch");
          return;
        }

        pageNumber += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
