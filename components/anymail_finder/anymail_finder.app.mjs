import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anymail_finder",
  propDefinitions: {
    company: {
      type: "string",
      label: "Company",
      description: "The name or website of the company to search for emails.",
    },
    personName: {
      type: "string",
      label: "Person's Name",
      description: "The full name of the person to search for within the company. Optional.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to search the emails at.",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name to search the emails at.",
    },
    preferredTitle: {
      type: "string",
      label: "Preferred Title",
      description: "The target job title to look for.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.anymailfinder.com/v5.0";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async searchEmails({
      domain, companyName, personName,
    }) {
      const path = personName
        ? "/search/person.json"
        : "/search/company.json";
      const data = personName
        ? {
          domain,
          full_name: personName,
        }
        : {
          domain,
          company_name: companyName,
        };

      return this._makeRequest({
        path,
        data,
      });
    },
    async searchPopularEmails({
      domain, companyName,
    }) {
      return this._makeRequest({
        path: "/search/company.json",
        data: {
          domain,
          company_name: companyName,
        },
      });
    },
    async searchPersonEmail({
      fullName,
      firstName,
      lastName,
      domain,
      companyName,
      countryCode,
    }) {
      return this._makeRequest({
        path: "/search/person.json",
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          domain,
          company_name: companyName,
          country_code: countryCode,
        },
      });
    },
    async listCompanyEmployees({
      domain,
      companyName,
      preferredTitle,
      countryCode,
    }) {
      return this._makeRequest({
        path: "/search/employees.json",
        data: {
          domain,
          company_name: companyName,
          preferred_title: preferredTitle,
          country_code: countryCode,
        },
      });
    },
  },
};
