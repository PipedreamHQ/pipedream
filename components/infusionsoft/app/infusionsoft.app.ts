import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateHookParams,
  DeleteHookParams,
  CreateOrderItemParams,
  CreatePaymentParams,
  GetObjectParams,
  HttpRequestParams,
} from "../types/requestParams";
import {
  Appointment,
  Company,
  Contact,
  Webhook,
  Order,
  Product,
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
    }: HttpRequestParams): Promise<object> {
      const response = await axios(this, {
        method,
        url: url ?? this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
      });

      return response.data;
    },
    async hookResponseRequest(apiUrl: string): Promise<object> {
      if (!(apiUrl && apiUrl.startsWith(this._baseUrl()))) {
        return {
          noUrl: true,
        };
      }

      return this._httpRequest({
        url: apiUrl,
      });
    },
    async createHook(data: CreateHookParams): Promise<Webhook> {
      return this._httpRequest({
        endpoint: "/hooks",
        method: "POST",
        data,
      });
    },
    async deleteHook({ key }: DeleteHookParams): Promise<number> {
      return this._httpRequest({
        endpoint: `/hooks/${key}`,
        method: "DELETE",
      });
    },
    async listCompanies(): Promise<Company[]> {
      const response = await this._httpRequest({
        endpoint: "/companies",
      });

      return response.companies;
    },
    async getCompany({ id }: GetObjectParams): Promise<Company> {
      return this._httpRequest({
        endpoint: `/companies/${id}`,
      });
    },
    async getAppointment({ id }: GetObjectParams): Promise<Appointment> {
      return this._httpRequest({
        endpoint: `/appointments/${id}`,
      });
    },
    async listContacts(): Promise<Contact[]> {
      const response = await this._httpRequest({
        endpoint: "/contacts",
      });

      return response.contacts;
    },
    async getContact({ id }: GetObjectParams): Promise<Contact> {
      return this._httpRequest({
        endpoint: `/contacts/${id}`,
      });
    },
    async listOrders(): Promise<Order[]> {
      const response = await this._httpRequest({
        endpoint: "/orders",
      });

      return response.orders;
    },
    async getOrder({ id }: GetObjectParams): Promise<Order> {
      return this._httpRequest({
        endpoint: `/orders/${id}`,
      });
    },
    getOrderSummary({
      contact, order_items, total,
    }: Order): string {
      return `${order_items.length} items (total ${total}) by ${contact.first_name}`;
    },
    async listProducts(): Promise<Product[]> {
      const response = await this._httpRequest({
        endpoint: "/products",
      });

      return response.products;
    },
    async createOrderItem({
      orderId,
      data,
    }: CreateOrderItemParams): Promise<object> {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/items`,
        method: "POST",
        data,
      });
    },
    async createPayment({
      orderId,
      data,
    }: CreatePaymentParams): Promise<object> {
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
        const companies: Company[] = await this.listCompanies();

        return companies.map(({
          company_name, id,
        }) => ({
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
      async options() {
        const contacts: Contact[] = await this.listContacts();

        return contacts.map(({
          given_name, id,
        }) => ({
          label: given_name ?? id.toString(),
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
      async options() {
        const orders: Order[] = await this.listOrders();

        return orders.map((order) => ({
          label: this.getOrderSummary(order),
          value: order.id,
        }));
      },
    },
    productId: {
      type: "integer",
      label: "Product",
      description: `Select a **Product** from the list.
        \\
        Alternatively, you can provide a custom *Product ID*.`,
      async options() {
        const products: Product[] = await this.listProducts();

        return products.map(({
          product_name, product_price, id,
        }) => ({
          label: `${product_name} (${product_price})`,
          value: id,
        }));
      },
    },
  },
});
