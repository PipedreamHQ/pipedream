import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gainsight_nxt",
  propDefinitions: {
    companyFields: {
      type: "string[]",
      label: "Company Fields",
      description: "An array of JSON strings representing company information. Include a 'name' field to identify the company.",
    },
    customObjectFields: {
      type: "string[]",
      label: "Custom Object Fields",
      description: "An array of JSON strings representing custom object elements. Include a 'name' field to identify the custom object.",
    },
    personFields: {
      type: "string[]",
      label: "Person Fields",
      description: "An array of JSON strings representing person information. Include an 'email' field to identify the person.",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.customer_domain}/v1/users/services/list`;
    },
    async _makeRequest({
      $ = this,
      path,
      headers = {},
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          headers: {
            "content-type": "application/json",
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "accesskey": `${this.gainsight_nxt.$auth.access_key}`,
            ...headers,
          },
        },
      });
    },
    // Company Methods
    async listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        method: "GET",
        params: opts.params,
      });
    },
    async getCompany(opts = {}) {
      return this._makeRequest({
        path: `/companies/${opts.id}`,
        method: "GET",
      });
    },
    async createCompany(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        method: "POST",
        data: opts.data,
      });
    },
    async updateCompany(opts = {}) {
      return this._makeRequest({
        path: `/companies/${opts.id}`,
        method: "PUT",
        data: opts.data,
      });
    },
    async createOrUpdateCompany(fields = {}) {
      const companyData = fields;
      const companyName = companyData.name;
      if (!companyName) {
        throw new Error("Company 'name' field is required for createOrUpdate.");
      }
      const response = await this.paginate(this.listCompanies, {
        name: companyName,
      });
      if (response.length > 0) {
        const company = response[0];
        return this.updateCompany({
          id: company.id,
          data: companyData,
        });
      } else {
        return this.createCompany({
          data: companyData,
        });
      }
    },
    // Custom Object Methods
    async listCustomObjects(opts = {}) {
      return this._makeRequest({
        path: "/custom_objects",
        method: "GET",
        params: opts.params,
      });
    },
    async getCustomObject(opts = {}) {
      return this._makeRequest({
        path: `/custom_objects/${opts.id}`,
        method: "GET",
      });
    },
    async createCustomObject(opts = {}) {
      return this._makeRequest({
        path: "/custom_objects",
        method: "POST",
        data: opts.data,
      });
    },
    async updateCustomObject(opts = {}) {
      return this._makeRequest({
        path: `/custom_objects/${opts.id}`,
        method: "PUT",
        data: opts.data,
      });
    },
    async createOrUpdateCustomObject(fields = {}) {
      const customObjectData = fields;
      const customObjectName = customObjectData.name;
      if (!customObjectName) {
        throw new Error("Custom Object 'name' field is required for createOrUpdate.");
      }
      const response = await this.paginate(this.listCustomObjects, {
        name: customObjectName,
      });
      if (response.length > 0) {
        const customObject = response[0];
        return this.updateCustomObject({
          id: customObject.id,
          data: customObjectData,
        });
      } else {
        return this.createCustomObject({
          data: customObjectData,
        });
      }
    },
    // Person Methods
    async listPersons(opts = {}) {
      return this._makeRequest({
        path: "/persons",
        method: "GET",
        params: opts.params,
      });
    },
    async getPerson(opts = {}) {
      return this._makeRequest({
        path: `/persons/${opts.id}`,
        method: "GET",
      });
    },
    async createPerson(opts = {}) {
      return this._makeRequest({
        path: "/persons",
        method: "POST",
        data: opts.data,
      });
    },
    async updatePerson(opts = {}) {
      return this._makeRequest({
        path: `/persons/${opts.id}`,
        method: "PUT",
        data: opts.data,
      });
    },
    async createOrUpdatePerson(fields = {}) {
      const personData = fields;
      const personEmail = personData.email;
      if (!personEmail) {
        throw new Error("Person 'email' field is required for createOrUpdate.");
      }
      const response = await this.paginate(this.listPersons, {
        email: personEmail,
      });
      if (response.length > 0) {
        const person = response[0];
        return this.updatePerson({
          id: person.id,
          data: personData,
        });
      } else {
        return this.createPerson({
          data: personData,
        });
      }
    },
    // Pagination Method
    async paginate(fn, params = {}) {
      let results = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const response = await fn({
          params: {
            ...params,
            page,
          },
        });
        if (response.length > 0) {
          results.push(...response);
          page += 1;
        } else {
          hasMore = false;
        }
      }
      return results;
    },
  },
  version: "0.0.{ts}",
};
