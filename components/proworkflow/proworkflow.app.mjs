import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "proworkflow",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company.",
      async options({ page }) {
        const { companies } = await this.listCompanies({
          params: {
            pagesize: constants.DEFAULT_LIMIT,
            pagenumber: page + 1,
          },
        });
        return companies.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category.",
      async options() {
        const { categories } = await this.listCategories();
        return categories.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
      async options({ page }) {
        const { projects } = await this.listProjects({
          params: {
            pagesize: constants.DEFAULT_LIMIT,
            pagenumber: page + 1,
          },
        });
        return projects.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task.",
      async options({ page }) {
        const { tasks } = await this.listTasks({
          params: {
            pagesize: constants.DEFAULT_LIMIT,
            pagenumber: page + 1,
          },
        });
        return tasks.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client.",
      async options({ page }) {
        const { contacts } = await this.listClientContacts({
          params: {
            pagesize: constants.DEFAULT_LIMIT,
            pagenumber: page + 1,
          },
        });
        return contacts.map(({
          id: value, firstname: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The type of the contact.",
      options: Object.values(constants.CONTACT_TYPES),
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
      optional: true,
    },
    taskName: {
      type: "string",
      label: "Name",
      description: "The name of the project task.",
    },
    taskDescription: {
      type: "string",
      label: "Description",
      description: "The description of the project task.",
      optional: true,
    },
    taskPriority: {
      type: "string",
      label: "Priority",
      description: "The priority of the project task.",
      options: Object.values(constants.TASK_PRIORITIES),
      optional: true,
    },
    taskStartDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the project task. Eg. `2021-01-01`",
      optional: true,
    },
    taskDueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the project task. Eg. `2021-01-01`",
      optional: true,
    },
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "apikey": this.$auth.api_key,
        ...headers,
      };
    },
    getAuth() {
      return {
        username: this.$auth.username,
        password: this.$auth.password,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        auth: this.getAuth(),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this.makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listCategories(args = {}) {
      return this.makeRequest({
        path: "/settings/projects/categories",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this.makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this.makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    listClientContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts/client",
        ...args,
      });
    },
  },
};
