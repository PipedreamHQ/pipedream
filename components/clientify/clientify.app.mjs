import { axios } from "@pipedream/platform";
import {
  ADDRESS_TYPE_OPTIONS, PHONE_TYPE_OPTIONS, STATUS_OPTIONS,
} from "./common/contants.mjs";

export default {
  type: "app",
  app: "clientify",
  propDefinitions: {
    addressType: {
      type: "integer",
      label: "Address Type",
      description: "The address' type.",
      options: ADDRESS_TYPE_OPTIONS,
    },
    city: {
      type: "string",
      label: "City",
      description: "The address' city.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Contact's company name.",
    },
    companyId: {
      type: "string",
      label: "Company Id",
      description: "The URL of the company.",
      async options({
        page, prevContext,
      }) {
        if (page && !prevContext.next) {
          return [];
        }

        const {
          next, results,
        } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });

        return {
          options: results.map(({
            url: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next,
          },
        };
      },
    },
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "Contact's unique Id.",
      async options({
        page, prevContext, useURL = false,
      }) {
        if (page && !prevContext.next) {
          return [];
        }

        const {
          next, results,
        } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });

        return {
          options: results.map(({
            id, url, first_name, last_name, email,
          }) => ({
            label: `${first_name} ${last_name} ${email
              ? "- " + email
              : ""} `,
            value: useURL
              ? url
              : id,
          })),
          context: {
            next,
            useURL,
          },
        };
      },
    },
    contactSource: {
      type: "string",
      label: "Contact Source",
      description: "Contact source.",
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "Contact type.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The address' country.",
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Contact's custom fields.",
    },
    dealId: {
      type: "string[]",
      label: "Deal Id",
      description: "A list of URLs of Deals",
      async options({
        page, prevContext,
      }) {
        if (page && !prevContext.next) {
          return [];
        }

        const {
          next, results,
        } = await this.listDeals({
          params: {
            page: page + 1,
          },
        });

        return {
          options: results.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next,
          },
        };
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "Contact's decription.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name.",
    },
    lastContact: {
      type: "string",
      label: "Last Contact",
      description: "Last contact date. Format: `YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]`",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message text to be shown in the contact wall.",
    },
    userId: {
      type: "string",
      label: "User Id",
      description: "Email of the user to own the task.",
      async options({
        page, prevContext, useURL = false,
      }) {
        if (page && !prevContext.next) {
          return [];
        }

        const {
          next, results,
        } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return {
          options: results.map(({
            username, url, first_name, last_name,
          }) => ({
            label: `${first_name} ${last_name}`,
            value: useURL
              ? url
              : username,
          })),
          context: {
            next,
            useURL,
          },
        };
      },
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone.",
    },
    phoneType: {
      type: "integer",
      label: "Phone Type",
      description: "Contact's phone type.",
      options: PHONE_TYPE_OPTIONS,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The address' postal code.",
    },
    remarks: {
      type: "string",
      label: "Remarks",
      description: "Contact's remarks.",
    },
    state: {
      type: "string",
      label: "State",
      description: "The address' state.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Contact's status identifier.",
      options: STATUS_OPTIONS,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The address' street.",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Contact's summary.",
    },
    taskType: {
      type: "string",
      label: "Task Type",
      description: "URL of the task type.",
      optional: true,
      async options() {
        const { results } = await this.listTaskTypes();

        return results.map(({
          url: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskStage: {
      type: "string",
      label: "Task Stage",
      description: "URL of the task stage.",
      optional: true,
      async options() {
        const { results } = await this.listTaskStages();

        return results.map(({
          url: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Contact's title.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.clientify.net/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Token ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}/`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "contacts",
        method: "POST",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "tasks",
        method: "POST",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "companies",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "deals",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "tasks",
        ...args,
      });
    },
    listTaskTypes(args = {}) {
      return this._makeRequest({
        path: "tasks/types",
        ...args,
      });
    },
    listTaskStages(args = {}) {
      return this._makeRequest({
        path: "tasks/types/stages",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "users",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `contacts/${contactId}`,
        method: "PUT",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { results } = await fn({
          params,
        });
        for (const d of results) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = !results;

      } while (lastPage);
    },
  },
};
