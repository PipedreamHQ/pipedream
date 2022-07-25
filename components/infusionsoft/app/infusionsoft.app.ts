import { defineApp } from "@pipedream/types";
import axios from "axios";
import {
  createHookParams,
  deleteHookParams,
  createOrderItemParams,
  createPaymentParams,
  getObjectParams,
  httpRequestParams,
} from "../types/requestParams";
import {
  appointment,
  company,
  contact,
  webhook,
  order,
  product,
} from "../types/responseSchemas";

export default defineApp({
  type: "app",
  app: "infusionsoft",
  methods: {
    _baseUrl(): string {
      return "https://api.infusionsoft.com/crm/rest/v1";
    },
    async _httpRequest({
      endpoint,
      data,
      method = "GET",
      url,
    }: httpRequestParams): Promise<object> {
      const response = await axios({
        method,
        url: url ?? this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
      });

      return response.data ?? response.status;
    },
    async hookResponseRequest(apiUrl: string): Promise<object> {
      if (!(apiUrl && apiUrl.startsWith(this._baseUrl()))) {
        return {
          noUrl: true
        };
      }

      return this._httpRequest({
        url: apiUrl
      });
    },
    async createHook(data: createHookParams): Promise<webhook> {
      return this._httpRequest({
        endpoint: "/hooks",
        method: "POST",
        data,
      });
    },
    async deleteHook({ key }: deleteHookParams): Promise<number> {
      return this._httpRequest({
        endpoint: `/hooks/${key}`,
        method: "DELETE",
      });
    },
    async listCompanies(): Promise<company[]> {
      const response = await this._httpRequest({
        endpoint: "/companies",
      });

      return response.companies;
    },
    async getCompany({ id }: getObjectParams): Promise<company> {
      return this._httpRequest({
        endpoint: `/companies/${id}`,
      });
    },
    async getAppointment({ id }: getObjectParams): Promise<appointment> {
      return this._httpRequest({
        endpoint: `/appointments/${id}`,
      });
    },
    async listContacts(): Promise<contact[]> {
      const response = await this._httpRequest({
        endpoint: "/contacts",
      });

      return response.contacts;
    },
    async getContact({ id }: getObjectParams): Promise<contact> {
      return this._httpRequest({
        endpoint: `/contacts/${id}`,
      });
    },
    async listOrders(): Promise<order[]> {
      const response = await this._httpRequest({
        endpoint: "/orders",
      });

      return response.orders;
    },
    async getOrder({ id }: getObjectParams): Promise<order> {
      return this._httpRequest({
        endpoint: `/orders/${id}`,
      });
    },
    getOrderSummary({ contact, order_items, total }: order): string {
      return `${order_items.length} items (total ${total}) by ${contact.first_name}`;
    },
    async listProducts(): Promise<product[]> {
      const response = await this._httpRequest({
        endpoint: "/products",
      });

      return response.products;
    },
    async createOrderItem({
      orderId,
      data,
    }: createOrderItemParams): Promise<object> {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/items`,
        method: "POST",
        data,
      });
    },
    async createPayment({
      orderId,
      data,
    }: createPaymentParams): Promise<object> {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/payments`,
        method: "POST",
        data,
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
      async options() {
        const companies: company[] = await this.listCompanies();

        return companies.map(
          ({ company_name, id }) => ({
            label: company_name,
            value: id,
          })
        );
      },
    },
    contactId: {
      type: "integer",
      label: "Contact",
      description: `Select a **Contact** from the list.
        \\
        Alternatively, you can provide a custom *Contact ID*.`,
      async options() {
        const contacts: contact[] = await this.listContacts();

        return contacts.map(
          ({ given_name, id }) => ({
            label: given_name ?? id.toString(),
            value: id,
          })
        );
      },
    },
    orderId: {
      type: "integer",
      label: "Order",
      description: `Select an **Order** from the list.
        \\
        Alternatively, you can provide a custom *Order ID*.`,
      async options() {
        const orders: order[] = await this.listOrders();

        return orders.map(
          (order) => ({
            label: this.getOrderSummary(order),
            value: order.id,
          })
        );
      },
    },
    productId: {
      type: "integer",
      label: "Product",
      description: `Select a **Product** from the list.
        \\
        Alternatively, you can provide a custom *Product ID*.`,
      async options() {
        const products: product[] = await this.listProducts();

        return products.map(
          ({
            product_name,
            product_price,
            id,
          }) => ({
            label: `${product_name} (${product_price})`,
            value: id,
          })
        );
      },
    },
  },
});
