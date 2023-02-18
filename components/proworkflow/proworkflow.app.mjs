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
      async options({ page }) {
        const { categories } = await this.listCategories({
          params: {
            pagesize: constants.DEFAULT_LIMIT,
            pagenumber: page + 1,
          },
        });
        return categories.map(({
          id: value, name: label,
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
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
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
        path: "/categories",
        ...args,
      });
    },
  },
};
