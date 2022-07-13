import { defineApp } from "@pipedream/types";
import axios from "axios";
import {
  apiResponse,
  createPaymentParams,
  getCompanyParams,
  getContactParams,
  httpRequestParams,
  companyObject,
  contactObject,
  orderObject,
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
    async listOrders(): Promise<object[]> {
      const response = await this._httpRequest({
        endpoint: "/orders",
      });

      return response.orders;
    },
    async createPayment({ orderId, data }: createPaymentParams): apiResponse {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/payments`,
        method: 'POST',
        data
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

        return companies.map(({ company_name, id }: companyObject) => ({
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

        return contacts.map(({ given_name, id }: contactObject) => ({
          label: given_name ?? id,
          value: id,
        }));
      },
    },
    orderId: {
      type: "integer",
      label: "Order",
      description: `Select an **Order** from the list.
        \\
        Alternatively, you can provide a custom *Order ID*.`,
      async options(): Promise<object[]> {
        const orders = await this.listOrders();

        return orders.map(
          ({ contact, id, order_items, total }: orderObject) => ({
            label: `${order_items.length} items (total ${total}) by ${contact.first_name} ${contact.last_name}`,
            value: id,
          })
        );
      },
    },
  },
});
