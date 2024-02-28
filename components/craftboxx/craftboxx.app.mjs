import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "craftboxx",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ page }) {
        const { data: projects } = await this.listProjects({
          params: {
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return projects.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        }));
      },
    },
    appointmentId: {
      type: "string",
      label: "Appointment ID",
      description: "The ID of the appointment",
      async options({ page }) {
        const { data: appointments } = await this.listAppointments({
          params: {
            per_page: constants.DEFAULT_LIMIT,
            page: page + 1,
          },
        });
        return appointments.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...args,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    listAppointments(args = {}) {
      return this._makeRequest({
        path: "/assignments",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async *getIterations({
      resourceFn, resourceFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              per_page: constants.DEFAULT_LIMIT,
              page,
              ...resourceFnArgs?.params,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

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

        if (response.next_page_url === null) {
          console.log("No next page found");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
