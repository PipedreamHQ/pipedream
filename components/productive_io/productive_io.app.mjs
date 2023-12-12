import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "productive_io",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project",
      description: "Select the project to associate with this task",
      async options({ page }) {
        const { data: projects } = await this.listProjects({
          params: {
            "page[number]": page,
            "page[size]": constants.DEFAULT_LIMIT,
          },
        });
        return projects.map((project) => ({
          label: project.attributes.name,
          value: project.id,
        }));
      },
    },
    taskListId: {
      type: "string",
      label: "Task List",
      description: "Select the task list to associate with this task",
      async options({
        page, projectId,
      }) {
        const { data: taskLists } = await this.listTaskLists({
          params: {
            "filter[project_id]": projectId,
            "page[number]": page,
            "page[size]": 20,
          },
        });
        return taskLists.map((taskList) => ({
          label: taskList.attributes.name,
          value: taskList.id,
        }));
      },
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The id of the person.",
      async options({ page }) {
        const { data: people } = await this.listPeople({
          params: {
            "page[number]": page,
            "page[size]": constants.DEFAULT_LIMIT,
          },
        });
        return people.map((person) => ({
          label: `${person.attributes.first_name} ${person.attributes.last_name} ${person.attributes.email}`.trim(),
          value: person.id,
        }));
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The id of the company.",
      async options({ page }) {
        const { data: companies } = await this.listCompanies({
          params: {
            "page[number]": page,
            "page[size]": constants.DEFAULT_LIMIT,
          },
        });
        return companies.map((company) => ({
          label: company.attributes.name,
          value: company.id,
        }));
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The id of the event.",
      async options({ page }) {
        const { data: events } = await this.listEvents({
          params: {
            "page[number]": page,
            "page[size]": constants.DEFAULT_LIMIT,
          },
        });
        return events.map((event) => ({
          label: event.attributes.name,
          value: event.id,
        }));
      },
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The id of the service.",
      async options({ page }) {
        const { data: services } = await this.listServices({
          params: {
            "page[number]": page,
            "page[size]": constants.DEFAULT_LIMIT,
          },
        });
        return services.map((service) => ({
          label: service.attributes.name,
          value: service.id,
        }));
      },
    },
  },
  methods: {
    getAuth() {
      return this.$auth;
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      const {
        auth_token: authToken,
        organization_id: organizationId,
      } = this.getAuth();

      return {
        ...headers,
        "X-Auth-Token": authToken,
        "X-Organization-Id": organizationId,
        "Content-Type": "application/vnd.api+json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const {
        getUrl,
        getHeaders,
      } = this;

      const config = {
        ...args,
        url: getUrl(path),
        headers: getHeaders(headers),
      };

      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listTaskLists(args = {}) {
      return this._makeRequest({
        path: "/task_lists",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this._makeRequest({
        path: "/people",
        ...args,
      });
    },
    listBookings(args = {}) {
      return this._makeRequest({
        path: "/bookings",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "/deals",
        ...args,
      });
    },
    listInvoices(args = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        path: "/events",
        ...args,
      });
    },
    listServices(args = {}) {
      return this._makeRequest({
        path: "/services",
        ...args,
      });
    },
  },
};
