import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agendor",
  propDefinitions: {
    personId: {
      type: "string",
      label: "Person ID",
      description: "The ID of the person to retrieveaa.",
      async options(prevContext) {
        const persons = await this.listPersons(prevContext.page + 1);
        return persons.data.map((person) => ({
          label: person.name,
          value: person.id,
        }));
      },
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization to retrieve.",
      async options(prevContext) {
        const organizations = await this.listOrganizations(prevContext.page + 1);
        return organizations.data.map((organization) => ({
          label: organization.name,
          value: organization.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "Owner User",
      description: "User ID or email of the owner of this organization.",
      optional: true,
      async options() {
        const users = await this.listUsers();
        return users.data.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    ranking: {
      type: "string",
      label: "Ranking",
      description: "Ranking displayed as stars in the page.",
      optional: true,
      options: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Your description of this organization.",
      optional: true,
    },
    contact: {
      type: "object",
      label: "Contact",
      description: "Contact object can have the following properties: `email, work, mobile, fax, whatsapp, facbeook, twitter, instagram, linked_in, skype`. Please check the documentation in the description for more information.",
      optional: true,
    },
    address: {
      type: "object",
      label: "Address",
      description: "Address Object can have the following properties: `postal_code, country, district, state, street_name, street_number, additional_info, city`. Please check the documentation in the description for more information.",
      optional: true,
    },
    leadOrigin: {
      type: "string",
      label: "Lead Origin",
      description: "Lead origin.",
      optional: true,
      async options() {
        const leadOrigins = await this.listLeadOrigins();
        return leadOrigins.data.map((leadOrigin) => ({
          label: leadOrigin.name,
          value: leadOrigin.id,
        }));
      },
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category ID or name.",
      optional: true,
      async options() {
        const categories = await this.listCategories();
        return categories.data.map((category) => ({
          label: category.name,
          value: category.id,
        }));
      },
    },
    sector: {
      type: "string",
      label: "Sector",
      description: "Sector ID or name.",
      optional: true,
      async options() {
        const sectors = await this.listSectors();
        return sectors.data.map((sector) => ({
          label: sector.name,
          value: sector.id,
        }));
      },
    },
    product: {
      type: "string",
      label: "Product",
      description: "Array of product IDs.",
      optional: true,
      async options(prevContext) {
        const products = await this.listProducts(prevContext.page + 1);
        return products.data.map((product) => ({
          label: product.name,
          value: product.id,
        }));
      },
    },
    allowToAllUsers: {
      type: "boolean",
      label: "Allow to All Users",
      description: "Set true if this organization should be visible to all users.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields information.",
      optional: true,
    },
  },
  methods: {
    _getApiToken() {
      return this.$auth.api_token;
    },
    _getBaseUrl() {
      return "https://api.agendor.com.br/v3";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Token ${this._getApiToken()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    getPerson(personId) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/people/${personId}`,
      });
    },
    listPersons(page) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/people",
        params: {
          page,
          per_page: 100,
        },
      });
    },
    listOrganizations(page) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/organizations",
        params: {
          page,
          per_page: 100,
        },
      });
    },
    getOrganization(organizationId) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/organizations/${organizationId}`,
      });
    },
    listUsers() {
      return this._makeHttpRequest({
        method: "GET",
        path: "/users",
      });
    },
    createOrganization(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/organizations",
        data,
      });
    },
    listLeadOrigins() {
      return this._makeHttpRequest({
        method: "GET",
        path: "/lead_origins",
      });
    },
    listCategories() {
      return this._makeHttpRequest({
        method: "GET",
        path: "/categories",
      });
    },
    listSectors() {
      return this._makeHttpRequest({
        method: "GET",
        path: "/sectors",
      });
    },
    listProducts(page) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/products",
        params: {
          page,
          per_page: 100,
        },
      });
    },
    createPerson(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/people",
        data,
      });
    },
  },
};
