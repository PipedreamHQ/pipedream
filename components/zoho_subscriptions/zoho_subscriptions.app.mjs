import { axios } from "@pipedream/platform";
import { clearObj } from "./common/utils.mjs";

export default {
  type: "app",
  app: "zoho_subscriptions",
  propDefinitions: {
    cardId: {
      type: "string",
      label: "Card Id",
      description: "Enter the card Id of the card which has to be updated..",
      async options({
        page, customerId, organizationId,
      }) {
        const { cards } = await this.listCreditCards({
          customerId,
          organizationId,
          params: {
            page: page + 1,
          },
        });

        return cards.map(({
          card_id: value, last_four_digits: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactPersonId: {
      type: "string",
      label: "Contact Person Id",
      description: "List of contact person Id.",
      async options({
        page, customerId, organizationId,
      }) {
        const { contactpersons } = await this.listContactPersons({
          customerId,
          organizationId,
          params: {
            page: page + 1,
          },
        });

        return contactpersons.map(({
          contactperson_id: value, first_name, last_name, email,
        }) => ({
          label: email
            ? email
            : `${first_name} ${last_name}`,
          value,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "Customer ID of the customer for whom a subscription needs to be created.",
      async options({
        page, organizationId,
      }) {
        const { customers } = await this.listCustomers({
          organizationId,
          params: {
            page: page + 1,
          },
        });

        return customers.map(({
          customer_id: value, display_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Additional fields for the invoices.",
    },
    organizationId: {
      type: "string",
      label: "Organization Id",
      description: "The Id of the organization you want to manage.",
      async options({ page }) {
        const { organizations } = await this.listOrganizations({
          params: {
            page: page + 1,
          },
        });

        return organizations.map(({
          organization_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    paymentTerms: {
      type: "integer",
      label: "Payment Terms",
      description: "Payment Due details for the invoices.",
    },
    paymentTermsLabel: {
      type: "string",
      label: "Payment Terms Label",
      description: "Label for the paymet due details.",
    },
    planCode: {
      type: "string",
      label: "Plan Code",
      description: "Plan code of the plan that is to be subscribed to the customer.",
      async options({
        page, organizationId,
      }) {
        const { plans } = await this.listPlans({
          organizationId,
          params: {
            page: page + 1,
          },
        });

        return plans.map(({
          plan_code: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return `${this.$auth.api_domain}/subscriptions/v1`;
    },
    _getHeaders(organizationId = null) {
      const headers = {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };

      if (organizationId) {
        headers["X-com-zoho-subscriptions-organizationid"] = organizationId;
      }
      return headers;
    },
    async _makeRequest({
      $ = this, path, organizationId, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(organizationId),
        ...opts,
      };

      return axios($, clearObj(config));
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "customers",
        ...args,
      });
    },
    createSubscription(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "subscriptions",
        ...args,
      });
    },
    getEvent({
      eventId, ...args
    }) {
      return this._makeRequest({
        path: `events/${eventId}`,
        ...args,
      });
    },
    listContactPersons({
      customerId, ...args
    }) {
      return this._makeRequest({
        path: `customers/${customerId}/contactpersons`,
        ...args,
      });
    },
    listCreditCards({
      customerId, ...args
    }) {
      return this._makeRequest({
        path: `customers/${customerId}/cards`,
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "customers",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        path: "events",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "organizations",
        ...args,
      });
    },
    listPlans(args = {}) {
      return this._makeRequest({
        path: "plans",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, organizationId, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          page_context: { has_more_page: hasMorePage },
          events: data,
        } = await fn({
          params,
          organizationId,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = hasMorePage;

      } while (lastPage);
    },
  },
};
