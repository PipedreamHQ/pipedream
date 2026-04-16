import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "upsales",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user or provide a user ID",
      async options({ page }) {
        const { data } = await this.listUsers({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((user) => ({
          label: `${user.name} (${user.email})`,
          value: user.clientid,
        }));
      },
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "Select a stage or provide a stage ID",
      async options({ page }) {
        const { data } = await this.listStages({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((stage) => ({
          label: `${stage.name} (${stage.probability}%)`,
          value: stage.id,
        }));
      },
    },
    stageName: {
      type: "string",
      label: "Name",
      description: "The name of the stage",
    },
    stageProbability: {
      type: "integer",
      label: "Probability",
      description: "The probability percentage (0-100) associated with this stage",
      min: 0,
      max: 100,
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Select a company or provide a company ID",
      async options({ page }) {
        const { data } = await this.listCompanies({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((company) => ({
          label: company.name,
          value: company.id,
        }));
      },
    },
    companyName: {
      type: "string",
      label: "Name",
      description: "The name of the company",
    },
    companyPhone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the company",
      optional: true,
    },
    companyWebpage: {
      type: "string",
      label: "Webpage",
      description: "The webpage URL of the company",
      optional: true,
    },
    companyCustom: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of custom field/value pairs in JSON format. Each entry should be a string like `{ \"value\": \"2210\", \"fieldId\": 3 }`",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Select a contact or provide a contact ID",
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((contact) => ({
          label: `${contact.name || `${contact.firstName} ${contact.lastName}`} (${contact.email || "No email"})`,
          value: contact.id,
        }));
      },
    },
    contactFirstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    contactLastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    contactPhone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    contactCellPhone: {
      type: "string",
      label: "Cell Phone",
      description: "The cell phone number of the contact",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
      optional: true,
    },
    contactTitle: {
      type: "string",
      label: "Title",
      description: "The job title of the contact",
      optional: true,
    },
    contactActive: {
      type: "boolean",
      label: "Active",
      description: "Whether the contact is active",
      optional: true,
    },
    contactClientId: {
      type: "integer",
      label: "Client ID",
      description: "The client ID to associate with this contact",
      optional: true,
    },
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "Select an activity or provide an activity ID",
      async options({ page }) {
        const { data } = await this.listActivities({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((activity) => ({
          label: `${activity.description || activity.type || "Activity"} (ID: ${activity.id})`,
          value: activity.id,
        }));
      },
    },
    npsId: {
      type: "string",
      label: "NPS ID",
      description: "Select an NPS record or provide an NPS ID",
      async options({ page }) {
        const { data } = await this.listNps({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((nps) => ({
          label: `NPS ${nps.id} - Score: ${nps.score || "N/A"}`,
          value: nps.id,
        }));
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "Select an order or provide an order ID",
      async options({ page }) {
        const { data } = await this.listOrders({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
            probability: 100,
          },
        });
        return data.map((order) => ({
          label: `${order.description || `Order ${order.id}`} - ${order.value || "N/A"}`,
          value: order.id,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "Select a product or provide a product ID",
      async options({ page }) {
        const { data } = await this.listProducts({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((product) => ({
          label: product.name,
          value: product.id,
        }));
      },
    },
    activityTypeId: {
      type: "string",
      label: "Activity Type ID",
      description: "Select an activity type or provide an activity type ID",
      async options({ page }) {
        const { data } = await this.listActivityTypes({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data.map((activityType) => ({
          label: activityType.name,
          value: activityType.id,
        }));
      },
    },
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "Select an opportunity or provide an opportunity ID",
      async options({ page }) {
        const { data } = await this.listOpportunities({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
            probability: [
              "gte:1",
              "lte:99",
            ],
          },
        });
        return data.map((opportunity) => ({
          label: opportunity.name,
          value: opportunity.id,
        }));
      },
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return. Defaults to 1000.",
      default: 1000,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of results to skip. Defaults to 0.",
      default: 0,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://integration.upsales.com/api/v2";
    },
    async _makeRequest({
      $ = this, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          token: this.$auth.api_key,
        },
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/master/users",
        ...args,
      });
    },
    async listUsers(args = {}) {
      return this._makeRequest({
        url: "/users",
        ...args,
      });
    },
    async getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        url: `/master/users/${userId}`,
        ...args,
      });
    },
    async deactivateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/master/users/${userId}`,
        ...args,
      });
    },
    async listStages(args = {}) {
      return this._makeRequest({
        url: "/orderstages",
        ...args,
      });
    },
    async getStage({
      stageId, ...args
    }) {
      return this._makeRequest({
        url: `/orderstages/${stageId}`,
        ...args,
      });
    },
    async createStage(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/orderstages",
        ...args,
      });
    },
    async updateStage({
      stageId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/orderstages/${stageId}`,
        ...args,
      });
    },
    async listCompanies(args = {}) {
      return this._makeRequest({
        url: "/accounts",
        ...args,
      });
    },
    async getCompany({
      companyId, ...args
    }) {
      return this._makeRequest({
        url: `/accounts/${companyId}`,
        ...args,
      });
    },
    async createCompany(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/accounts",
        ...args,
      });
    },
    async updateCompany({
      companyId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/accounts/${companyId}`,
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        url: "/contacts",
        ...args,
      });
    },
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        url: `/contacts/${contactId}`,
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/contacts",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/contacts/${contactId}`,
        ...args,
      });
    },
    async listActivities(args = {}) {
      return this._makeRequest({
        url: "/activities",
        ...args,
      });
    },
    async getActivity({
      activityId, ...args
    }) {
      return this._makeRequest({
        url: `/activities/${activityId}`,
        ...args,
      });
    },
    async listAppointments(args = {}) {
      return this._makeRequest({
        url: "/appointments",
        ...args,
      });
    },
    async createAppointment(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/appointments",
        ...args,
      });
    },
    async updateAppointment({
      appointmentId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/appointments/${appointmentId}`,
        ...args,
      });
    },
    async listPhoneCalls(args = {}) {
      return this._makeRequest({
        url: "/phoneCall",
        ...args,
      });
    },
    async listNps(args = {}) {
      return this._makeRequest({
        url: "/nps",
        ...args,
      });
    },
    async getNps({
      npsId, ...args
    }) {
      return this._makeRequest({
        url: `/nps/${npsId}`,
        ...args,
      });
    },
    async listOrders(args = {}) {
      return this._makeRequest({
        url: "/orders",
        ...args,
      });
    },
    async getOrder({
      orderId, ...args
    }) {
      return this._makeRequest({
        url: `/orders/${orderId}`,
        ...args,
      });
    },
    async createOrder(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/orders",
        ...args,
      });
    },
    async updateOrder({
      orderId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/orders/${orderId}`,
        ...args,
      });
    },
    async listProducts(args = {}) {
      return this._makeRequest({
        url: "/products",
        ...args,
      });
    },
    async getProduct({
      productId, ...args
    }) {
      return this._makeRequest({
        url: `/products/${productId}`,
        ...args,
      });
    },
    async listActivityTypes(args = {}) {
      return this._makeRequest({
        url: "/todoTypes",
        ...args,
      });
    },
    async uploadOrderDocument({
      orderId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/resources/upload/internal/orders/${orderId}`,
        ...args,
      });
    },
  },
};
