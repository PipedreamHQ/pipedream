import { axios } from "@pipedream/platform";

export default {
  name: "Create Contact",
  version: "0.0.1",
  key: "accelo-create-contact",
  description: "Creates a contact. [See docs here](https://api.accelo.com/docs/?_ga=2.136158329.97118171.1674049767-1568937371.1674049767#create-a-contact)",
  type: "action",
  props: {
    accelo: {
      type: "app",
      app: "accelo",
    },
    companyId: {
      label: "Company ID",
      description: "The company ID",
      type: "string",
      async options() {
        const { response: companies } = await this.getCompanies();
        return companies.map((company) => ({
          value: company.id,
          label: company.name,
        }));
      },
    },
    firstname: {
      label: "First Name",
      description: "The contact's first name",
      type: "string",
    },
    middlename: {
      label: "Middle Name",
      description: "The contact's middle name",
      type: "string",
      optional: true,
    },
    surname: {
      label: "Surname",
      description: "The contact's surname",
      type: "string",
    },
    username: {
      label: "Username",
      description: "The contact's new username, this must be a unique username",
      type: "string",
      optional: true,
    },
    password: {
      label: "Password",
      description: "The contact's new password for the Accelo deployment",
      type: "string",
      optional: true,
    },
    title: {
      label: "Title",
      description: "The contact's title",
      type: "string",
      optional: true,
    },
    phone: {
      label: "Phone",
      description: "The contact's phone number in their role in the associated company.",
      type: "string",
      optional: true,
    },
    email: {
      label: "Email",
      description: "The contact's email in their role in the associated company.",
      type: "string",
      optional: true,
    },
  },
  methods: {
    _hostname() {
      return this.$auth.hostname;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://${this._hostname()}.api.accelo.com/api/v0`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async getCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "post",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const { response } = await this.createContact({
      $,
      data: {
        company_id: this.companyId,
        firstname: this.firstname,
        middlename: this.middlename,
        surname: this.surname,
        username: this.username,
        password: this.password,
        title: this.title,
        phone: this.phone,
        email: this.email,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created contact with id ${response.id}`);
    }

    return response;
  },
};
