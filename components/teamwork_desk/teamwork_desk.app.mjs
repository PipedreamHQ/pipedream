import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamwork_desk",
  propDefinitions: {
    address: {
      type: "string",
      label: "Address",
      description: "Customer address.",
    },
    avatarURL: {
      type: "string",
      label: "Avatar URL",
      description: "Customer avatar URL.",
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "List of BCC for the initial message.",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "List of CC for the initial message.",
    },
    companyId: {
      type: "string",
      label: "Company",
      description: "The company that the customer belongs to.",
      async options({ page }) {
        const { companies } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });

        return companies.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer",
      description: "The customer id.",
      async options({ page }) {
        const { customers } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        return customers.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer. Email ticket replies and chat transcriptions will be sent to the customer at this address.",
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "Customer external ID.",
    },
    extraData: {
      type: "string",
      label: "Extra Data",
      description: "Provides a free-form reference field for additional customer information.",
    },
    facebookURL: {
      type: "string",
      label: "Facebook URL",
      description: "The Facebook URL address of the customer.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer.",
    },
    inboxes: {
      type: "string[]",
      label: "Inboxes",
      description: "Which inbox this source will receive.",
      default: [
        "all",
      ],
      async options({ page }) {
        const { inboxes } = await this.listInboxes({
          params: {
            page: page + 1,
          },
        });

        return [
          {
            value: "all",
            label: "All",
          },
          ...inboxes.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
        ];
      },
    },
    inboxId: {
      type: "string",
      label: "Inbox ID",
      description: "The id of the inbox.",
      async options({ page }) {
        const { inboxes } = await this.listInboxes({
          params: {
            page: page + 1,
          },
        });

        return inboxes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Customer job title.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer.",
    },
    linkedinURL: {
      type: "string",
      label: "LinkedinURL",
      description: "The Linkedin URL address of the customer.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The ticket's initial message.",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The customer mobile.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Provides a free-form reference field for additional customer information.",
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to notify the customer when an agent creates a ticket on behalf of the customer.",
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "Organization is the name of the organization that the Customer is in. This feature has been deprecated in favor of `companies`.",
    },
    permission: {
      type: "string",
      label: "Permission",
      description: "Overrides the company ticket permission settings. Is only valid for customers that belongs to a company.",
      options: [
        "own",
        "all",
      ],
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Customer phone.",
    },
    priorityId: {
      type: "string",
      label: "Priority Id",
      description: "The Id of the priority.",
      async options({ page }) {
        const { ticketpriorities } = await this.listPriorities({
          params: {
            page: page + 1,
          },
        });

        return ticketpriorities.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sourceId: {
      type: "string",
      label: "Source Id",
      description: "The Id of the source.",
      async options({ page }) {
        const { ticketsources } = await this.listSources({
          params: {
            page: page + 1,
          },
        });

        return ticketsources.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The ticket's subject.",
    },
    statusId: {
      type: "string",
      label: "Status Id",
      description: "The Id of the status.",
      async options({ page }) {
        const { ticketstatuses } = await this.listStatuses({
          params: {
            page: page + 1,
          },
        });

        return ticketstatuses.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "The list of word the ticket was tagged with.",
      async options({ page }) {
        const { tags } = await this.listTags({
          params: {
            page: page + 1,
          },
        });

        return tags.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    threadType: {
      type: "string",
      label: "Thread Type",
      description: "The type of the thread",
      options: [
        "Message",
        "Note",
        "Forward",
      ],
    },
    typeId: {
      type: "string",
      label: "Type Id",
      description: "The Id of the type.",
      async options({ page }) {
        const { tickettypes } = await this.listTypes({
          params: {
            page: page + 1,
          },
        });

        return tickettypes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket Id",
      description: "The Id of the ticket.",
      async options({ page }) {
        const { tickets } = await this.listTickets({
          params: {
            page: page + 1,
          },
        });

        return tickets.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    twitterHandle: {
      type: "string",
      label: "Twitter Handle",
      description: "The Twitter Handle of the customer.",
    },
  },
  methods: {
    _apiUrl(version) {
      return `${this.$auth.domain.replace(/\/?$/, "/")}desk/${version}`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this, version = "api/v2", path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl(version)}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        path: "customers.json",
        method: "POST",
        ...args,
      });
    },
    createCustomerReply({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `tickets/${ticketId}/messages.json`,
        method: "POST",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        path: "webhooks.json",
        method: "POST",
        version: "v1",
        ...args,
      });
    },
    createTicket(args = {}) {
      return this._makeRequest({
        path: "tickets.json",
        method: "POST",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "companies.json",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "customers.json",
        ...args,
      });
    },
    listInboxes(args = {}) {
      return this._makeRequest({
        path: "inboxes.json",
        ...args,
      });
    },
    listPriorities(args = {}) {
      return this._makeRequest({
        path: "ticketpriorities.json",
        ...args,
      });
    },
    listSources(args = {}) {
      return this._makeRequest({
        path: "ticketsources.json",
        ...args,
      });
    },
    listStatuses(args = {}) {
      return this._makeRequest({
        path: "ticketstatuses.json",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "tags.json",
        ...args,
      });
    },
    listTypes(args = {}) {
      return this._makeRequest({
        path: "tickettypes.json",
        ...args,
      });
    },
    listTickets(args = {}) {
      return this._makeRequest({
        path: "tickets.json",
        ...args,
      });
    },
    updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        path: `customers/${customerId}.json`,
        method: "PATCH",
        ...args,
      });
    },
    updateTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `tickets/${ticketId}.json`,
        method: "PATCH",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        path: `webhooks/${hookId}.json`,
        version: "v1",
        method: "DELETE",
      });
    },
  },
};
