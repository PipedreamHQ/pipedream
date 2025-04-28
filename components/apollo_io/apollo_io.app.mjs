import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "apollo_io",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Identifier of the account for this contact",
      async options({ page }) {
        const { accounts } = await this.searchAccounts({
          params: {
            page: page + 1,
          },
        });
        return accounts?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Identifier of the contact to update",
      async options({ page }) {
        const { contacts } = await this.searchContacts({
          params: {
            page: page + 1,
          },
        });
        return contacts?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contactStageId: {
      type: "string",
      label: "Contact Stage ID",
      description: "Identifier of a contact stage",
      async options() {
        const { contact_stages: stages } = await this.listContactStages();
        return stages?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    accountStageId: {
      type: "string",
      label: "Account Stage ID",
      description: "Identifier of an account stage",
      async options() {
        const { account_stages: stages } = await this.listAccountStages();
        return stages?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    sequenceId: {
      type: "string",
      label: "Sequence ID",
      description: "Identifier of a sequence",
      async options() {
        const { emailer_campaigns: sequences } = await this.listSequences();
        return sequences?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    emailAccountId: {
      type: "string",
      label: "Email Account ID",
      description: "Identifier of the email account to send email from",
      async options() {
        const { email_accounts: emails } = await this.listEmailAccounts();
        return emails?.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "Identifier of the user to associate as owner.",
      async options() {
        const { users } = await this.listUsers();
        return users?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity.",
      async options({ page }) {
        const { opportunities } = await this.listOpportunities({
          page: page + 1,
        });
        return opportunities?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    opportunityStageId: {
      type: "string",
      label: "Opportunity Stage ID",
      description: "The ID of the current stage.",
      async options() {
        const { opportunity_stages: stages } = await this.listOpportunityStages();
        return stages?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title this contact",
      optional: true,
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The organization website Apollo can use to enrich data for you. DO NOT pass in personal social media URLs such as \"http://www.linkedin.com/profile_url\", or your data will be incorrectly enriched. This argument will be ignored if you pass in a valid email.",
      optional: true,
    },
    labelNames: {
      type: "string[]",
      label: "Label Names",
      description: "A list of names to tag this contact. You can select the labels from the list or create new ones using a custom expression, i.e., `[\"label1\", \"label2\"]`",
      optional: true,
      async options() {
        const response = await this.listLabels();
        return response.map(({ name }) => name) || [];
      },
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address string for this contact, Apollo will intelligently infer the city, state, country, and time zone from your address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The direct dial phone for this contact",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the account",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the account you are adding",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": this.$auth.api_key,
        ...headers,
      };
    },
    getParams(params) {
      return {
        ...params,
      };
    },
    makeRequest({
      step = this, path, headers, params, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        params: this.getParams(params),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listContactStages(args = {}) {
      return this.makeRequest({
        path: "/contact_stages",
        ...args,
      });
    },
    listAccountStages(args = {}) {
      return this.makeRequest({
        path: "/account_stages",
        ...args,
      });
    },
    listSequences(args = {}) {
      return this.post({
        path: "/emailer_campaigns/search",
        ...args,
      });
    },
    listEmailAccounts(args = {}) {
      return this.makeRequest({
        path: "/email_accounts",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this.makeRequest({
        path: "/users/search",
        ...args,
      });
    },
    listOpportunities(args = {}) {
      return this.makeRequest({
        path: "/opportunities/search",
        ...args,
      });
    },
    listOpportunityStages(args = {}) {
      return this.makeRequest({
        path: "/opportunity_stages",
        ...args,
      });
    },
    createContact(args = {}) {
      return this.post({
        path: "/contacts",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this.put({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    updateContactStage(args = {}) {
      return this.post({
        path: "/contacts/update_stages",
        ...args,
      });
    },
    createAccount(args = {}) {
      return this.post({
        path: "/accounts",
        ...args,
      });
    },
    createOpportunity(args = {}) {
      return this.post({
        path: "/opportunities",
        ...args,
      });
    },
    updateOpportunity({
      opportunityId, ...args
    }) {
      return this.patch({
        path: `/opportunities/${opportunityId}`,
        ...args,
      });
    },
    getOpportunity({
      opportunityId, ...args
    }) {
      return this.makeRequest({
        path: `/opportunities/${opportunityId}`,
        ...args,
      });
    },
    updateAccount({
      accountId, ...args
    }) {
      return this.put({
        path: `/accounts/${accountId}`,
        ...args,
      });
    },
    updateAccountStage(args = {}) {
      return this.post({
        path: "/accounts/bulk_update",
        ...args,
      });
    },
    addContactsToSequence({
      sequenceId, ...args
    }) {
      return this.post({
        path: `/emailer_campaigns/${sequenceId}/add_contact_ids`,
        ...args,
      });
    },
    searchAccounts(args = {}) {
      return this.post({
        path: "/accounts/search",
        ...args,
      });
    },
    searchContacts(args = {}) {
      return this.post({
        path: "/contacts/search",
        ...args,
      });
    },
    listLabels(args = {}) {
      return this.makeRequest({
        path: "/labels",
        ...args,
      });
    },
    async *getIterations({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              per_page: constants.DEFAULT_LIMIT,
              page,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
