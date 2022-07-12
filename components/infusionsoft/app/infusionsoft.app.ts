import { defineApp } from "@pipedream/types";
import axios from "axios";
import {
  apiResponse,
  getCompanyParams,
  getContactParams,
  httpRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "infusionsoft",
  methods: {
    _baseUrl(): string {
      return "https://api.infusionsoft.com/crm/rest/v1";
    },
    async _httpRequest({
      method = "GET",
      endpoint,
      data,
    }: httpRequestParams): apiResponse {
      return axios({
        method,
        url: this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
      });
    },
    async listCompanies(): Promise<object[]> {
      const response = await this._httpRequest({
        endpoint: "/companies",
      });

      return response.companies;
    },
    async getCompany({ companyId }: getCompanyParams): apiResponse {
      return this._httpRequest({
        endpoint: `/companies/${companyId}`,
      });
    },
    async listContacts(): Promise<object[]> {
      const response = await this._httpRequest({
        endpoint: "/contacts",
      });

      return response.contacts;
    },
    async getContact({ contactId }: getContactParams): apiResponse {
      return this._httpRequest({
        endpoint: `/contacts/${contactId}`,
      });
    },
  },
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company",
      description: `Select a **Company** from the list.
        \\
        Alternatively, you can provide a custom *Company ID*.`,
      async options(): Promise<object[]> {
        const companies = await this.listCompanies();

        return companies.map(({ company_name, id }) => ({
          label: company_name,
          value: id,
        }));
      },
    },
    contactId: {
      type: "integer",
      label: "Contact",
      description: `Select a **Contact** from the list.
        \\
        Alternatively, you can provide a custom *Contact ID*.`,
      async options(): Promise<object[]> {
        const contacts = await this.listContacts();

        return contacts.map(({ given_name, id }) => ({
          label: given_name ?? id,
          value: id,
        }));
      },
    },
  },
});
