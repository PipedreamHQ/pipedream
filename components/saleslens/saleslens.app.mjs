import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "saleslens",
  propDefinitions: {
    employeeExternalId: {
      type: "string",
      label: "Employee External ID",
      description: "The external ID of the employee",
      async options() {
        const employees = await this.listEmployees();
        return employees.map(({
          firstName, lastName, externalId: value,
        }) => ({
          label: [
            firstName,
            lastName,
          ].join(" ").trim() || value,
          value,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category",
      optional: true,
      async options() {
        const categories = await this.getCategories();
        return categories.map(({
          title: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Locale of the transcription or recording",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the transcription or recording",
      optional: true,
    },
    fileExtension: {
      type: "string",
      label: "File Extension",
      description: "File extension of the transcription or recording",
      optional: true,
    },
    httpHeader: {
      type: "string",
      label: "HTTP Header",
      description: "If your download URL requires authorization, use this parameter as a string. Eg. `Authorization: Bearer <token>`",
      optional: true,
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "Tags associated with the transcription or recording separated by commas. Eg. `api, download, example`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.saleslens.io/api";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: this.$auth.api_token,
        },
      });
    },
    post({
      data, ...args
    } = {}) {
      return this._makeRequest({
        ...args,
        method: "post",
        data: utils.filterProps(data),
      });
    },
    listEmployees(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/access_token/employees",
      });
    },
    getCategories(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/access_token/categories",
      });
    },
  },
};
