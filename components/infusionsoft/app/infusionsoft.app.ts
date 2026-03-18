import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddContactToAutomationParams,
  ApplyTagToContactsParams,
  CreateAffiliateParams,
  CreateCompanyParams,
  CreateContactParams,
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
    _baseUrlV2(): string {
      return "https://api.infusionsoft.com/crm/rest/v2";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      url,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: url ?? this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
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
    async getCompany({
      id, ...params
    }: GetObjectParams): Promise<Company> {
      return this._httpRequest({
        endpoint: `/companies/${id}`,
        ...params,
      });
    },
    async getAppointment({
      id,
      ...params
    }: GetObjectParams): Promise<Appointment> {
      return this._httpRequest({
        endpoint: `/appointments/${id}`,
        ...params,
      });
    },
    async listContacts(): Promise<Contact[]> {
      const response = await this._httpRequest({
        endpoint: "/contacts",
      });

      return response.contacts;
    },
    async getContact({
      id, ...params
    }: GetObjectParams): Promise<Contact> {
      return this._httpRequest({
        endpoint: `/contacts/${id}`,
        ...params,
      });
    },
    async listOrders(): Promise<Order[]> {
      const response = await this._httpRequest({
        endpoint: "/orders",
      });

      return response.orders;
    },
    async getOrder({
      id, ...params
    }: GetObjectParams): Promise<Order> {
      return this._httpRequest({
        endpoint: `/orders/${id}`,
        ...params,
      });
    },
    getOrderSummary({
      contact, order_items, total,
    }: Order): string {
      return `${order_items.length} items (total $${total}) by ${contact.first_name}`;
    },
    async listProducts(): Promise<Product[]> {
      const response = await this._httpRequest({
        endpoint: "/products",
      });

      return response.products;
    },
    async createOrderItem({
      orderId,
      ...params
    }: CreateOrderItemParams): Promise<object> {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/items`,
        method: "POST",
        ...params,
      });
    },
    async createPayment({
      orderId,
      ...params
    }: CreatePaymentParams): Promise<object> {
      return this._httpRequest({
        endpoint: `/orders/${orderId}/payments`,
        method: "POST",
        ...params,
      });
    },
    async createCompany({
      $,
      companyName,
      email,
      phoneNumber,
      website,
      addressLine1,
      addressLine2,
      locality,
      region,
      regionCode,
      postalCode,
      country,
      countryCode,
      notes,
      customFields,
    }: CreateCompanyParams): Promise<object> {
      const body: Record<string, unknown> = {
        company_name: companyName.trim(),
      };

      if (email?.trim()) {
        body.email_address = {
          email: email.trim(),
          field: "EMAIL1",
        };
      }

      if (phoneNumber?.trim()) {
        body.phone_number = {
          number: phoneNumber.trim(),
          field: "PHONE1",
        };
      }

      if (website?.trim()) {
        body.website = website.trim();
      }

      if (
        addressLine1 ||
        addressLine2 ||
        locality ||
        region ||
        regionCode ||
        postalCode ||
        country ||
        countryCode
      ) {
        const address: Record<string, string> = {};
        if (addressLine1?.trim()) address.line1 = addressLine1.trim();
        if (addressLine2?.trim()) address.line2 = addressLine2.trim();
        if (locality?.trim()) address.locality = locality.trim();
        if (region?.trim()) address.region = region.trim();
        if (regionCode?.trim()) address.region_code = regionCode.trim();
        if (postalCode?.trim()) address.postal_code = postalCode.trim();
        if (country?.trim()) address.country = country.trim();
        if (countryCode?.trim()) address.country_code = countryCode.trim();
        body.address = address;
      }

      if (notes?.trim()) {
        body.notes = notes.trim();
      }

      if (customFields?.trim()) {
        try {
          const parsed = JSON.parse(customFields);
          if (Array.isArray(parsed)) {
            body.custom_fields = parsed;
          }
        } catch {
          // Skip invalid custom_fields JSON
        }
      }

      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/companies`,
        method: "POST",
        data: body,
      });
    },
    async createContact({
      $,
      givenName,
      familyName,
      email,
      phoneNumber,
      companyName,
      companyId,
      jobTitle,
      ownerId,
      leadsourceId,
      customFields,
    }: CreateContactParams): Promise<object> {
      const body: Record<string, unknown> = {};

      if (givenName?.trim()) body.given_name = givenName.trim();
      if (familyName?.trim()) body.family_name = familyName.trim();
      if (jobTitle?.trim()) body.job_title = jobTitle.trim();
      if (ownerId?.trim()) body.owner_id = parseInt(ownerId.trim(), 10);
      if (leadsourceId?.trim()) body.leadsource_id = parseInt(leadsourceId.trim(), 10);

      if (email?.trim()) {
        body.email_addresses = [
          { email: email.trim(), field: "EMAIL1" },
        ];
      }

      if (phoneNumber?.trim()) {
        body.phone_numbers = [
          { number: phoneNumber.trim(), field: "PHONE1" },
        ];
      }

      const company: Record<string, unknown> = {};
      if (companyId?.trim()) company.id = parseInt(companyId.trim(), 10);
      if (companyName?.trim()) company.company_name = companyName.trim();
      if (Object.keys(company).length > 0) body.company = company;

      if (customFields?.trim()) {
        try {
          const parsed = JSON.parse(customFields);
          if (Array.isArray(parsed)) {
            body.custom_fields = parsed;
          }
        } catch {
          // Skip invalid custom_fields JSON
        }
      }

      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/contacts`,
        method: "POST",
        data: body,
      });
    },
    async createAffiliate({
      $,
      code,
      contactId,
      status,
      name,
    }: CreateAffiliateParams): Promise<object> {
      const body: Record<string, string> = {
        code: code.trim(),
        contact_id: contactId.trim(),
        status: status.trim().toUpperCase(),
      };
      if (name?.trim()) {
        body.name = name.trim();
      }
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/affiliates`,
        method: "POST",
        data: body,
      });
    },
    async applyTagToContacts({
      $,
      tagId,
      contactIds,
    }: ApplyTagToContactsParams): Promise<object> {
      return this._httpRequest({
        $,
        url: `${this._baseUrlV2()}/tags/contacts`,
        method: "POST",
        data: {
          tag_ids: [parseInt(tagId, 10)],
          contact_ids: contactIds.map((id) => parseInt(id, 10)),
        },
      });
    },
    async addContactToAutomation({
      $,
      automationId,
      sequenceId,
      contactIds,
    }: AddContactToAutomationParams): Promise<object> {
      const results = [];
      const body: Record<string, number> = {
        sequence_id: parseInt(sequenceId, 10),
      };
      if (automationId) {
        body.campaign_id = parseInt(automationId, 10);
      }
      for (const contactId of contactIds) {
        const result = await this._httpRequest({
          $,
          endpoint: `/contacts/${contactId}/sequences`,
          method: "POST",
          data: body,
        });
        results.push({ contactId, ...result });
      }
      return { data: results };
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
          label: `${product_name} ($${product_price})`,
          value: id,
        }));
      },
    },
  },
});
