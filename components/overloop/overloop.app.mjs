import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "overloop",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The identifier of a contact",
      async options({ page }) {
        const { data: contacts } = await this.listContacts({
          params: {
            page_number: page + 1,
          },
        });
        return contacts?.map((contact) => ({
          label: `${contact.attributes.first_name} ${contact.attributes.last_name}`,
          value: contact.id,
        })) || [];
      },
    },
    automationId: {
      type: "string",
      label: "Campaign ID",
      description: "The identifier of a campaign",
      async options({
        page, type, status, recordType,
      }) {
        let filter = `automation_type:${type}`;
        if (status) {
          filter += `,status:${status}`;
        }
        if (recordType) {
          filter += `,record_type:${recordType}`;
        }
        const { data: campaigns } = await this.listAutomations({
          params: {
            page_number: page + 1,
            filter,
          },
        });
        return campaigns?.map((campaign) => ({
          label: campaign.attributes.name,
          value: campaign.id,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The identifier of a user",
      optional: true,
      async options({ page }) {
        const { data: users } = await this.listUsers({
          params: {
            page_number: page + 1,
          },
        });
        return users?.map((user) => ({
          label: user.attributes.name,
          value: user.id,
        })) || [];
      },
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The identifier of an organization",
      optional: true,
      async options({ page }) {
        const { data: orgs } = await this.listOrganizations({
          params: {
            page_number: page + 1,
          },
        });
        return orgs?.map((org) => ({
          label: org.attributes.name,
          value: org.id,
        })) || [];
      },
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "The identifier of a deal",
      async options({ page }) {
        const { data: deals } = await this.listDeals({
          params: {
            page_number: page + 1,
          },
        });
        return deals?.map((deal) => ({
          label: deal.attributes.title,
          value: deal.id,
        })) || [];
      },
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "The identifier of a stage",
      optional: true,
      async options({ page }) {
        const { data: stages } = await this.listStages({
          params: {
            page_number: page + 1,
          },
        });
        return stages?.map((stage) => ({
          label: stage.attributes.name,
          value: stage.id,
        })) || [];
      },
    },
    listNames: {
      type: "string[]",
      label: "List Names",
      description: "An array of list names",
      optional: true,
      async options({ page }) {
        const { data: lists } = await this.listLists({
          params: {
            page_number: page + 1,
          },
        });
        return lists?.map((list) => list.attributes.name ) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the deal",
      optional: true,
    },
    value: {
      type: "integer",
      label: "Value",
      description: "The value of the deal",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the organization",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.overloop.com/public/v1";
    },
    _headers() {
      return {
        Authorization: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "/deals",
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    listPipelines(args = {}) {
      return this._makeRequest({
        path: "/pipelines",
        ...args,
      });
    },
    listStages(args = {}) {
      return this._makeRequest({
        path: "/stages",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    listAutomations(args = {}) {
      return this._makeRequest({
        path: "/automations",
        ...args,
      });
    },
    listExclusingListItems(args = {}) {
      return this._makeRequest({
        path: "/exclusion_list_items",
        ...args,
      });
    },
    getContact(contactId, args = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    getDeal(dealId, args = {}) {
      return this._makeRequest({
        path: `/deals/${dealId}`,
        ...args,
      });
    },
    getOrganization(organizationId, args = {}) {
      return this._makeRequest({
        path: `/organizations/${organizationId}`,
        ...args,
      });
    },
    createEnrollment(automationId, args = {}) {
      return this._makeRequest({
        path: `/automations/${automationId}/enrollments`,
        method: "POST",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    updateContact(contactId, args = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "PATCH",
        ...args,
      });
    },
    createDeal(args = {}) {
      return this._makeRequest({
        path: "/deals",
        method: "POST",
        ...args,
      });
    },
    updateDeal(dealId, args = {}) {
      return this._makeRequest({
        path: `/deals/${dealId}`,
        method: "PATCH",
        ...args,
      });
    },
    markDealLost(dealId, args = {}) {
      return this._makeRequest({
        path: `/deals/${dealId}/mark_as_lost`,
        method: "POST",
        ...args,
      });
    },
    markDealWon(dealId, args = {}) {
      return this._makeRequest({
        path: `/deals/${dealId}/mark_as_won`,
        method: "POST",
        ...args,
      });
    },
    createOrganization(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        method: "POST",
        ...args,
      });
    },
    updateOrganization(organizationId, args = {}) {
      return this._makeRequest({
        path: `/organizations/${organizationId}`,
        method: "PATCH",
        ...args,
      });
    },
    createExclusionListItem(args = {}) {
      return this._makeRequest({
        path: "/exclusion_list_items",
        method: "POST",
        ...args,
      });
    },
  },
};
