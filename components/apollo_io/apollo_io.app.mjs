import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "apollo_io",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Identifier of the account for this contact",
      async options({ page }) {
        const { accounts } = await this.listAccounts({
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
        const { contacts } = await this.listContacts({
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
      description: "A list of names to tag this newly created contact. If the name does not exist, Apollo will automatically create it",
      optional: true,
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
        ...headers,
      };
    },
    getParams(params) {
      return {
        api_key: this.$auth.api_key,
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
    listAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts/search",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts/search",
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
      return this.makeRequest({
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
    createContact(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/contacts",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this.makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    updateContactStage(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/contacts/update_stages",
        ...args,
      });
    },
    createAccount(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/accounts",
        ...args,
      });
    },
    updateAccount({
      accountId, ...args
    }) {
      return this.makeRequest({
        method: "PUT",
        path: `/accounts/${accountId}`,
        ...args,
      });
    },
    updateAccountStage(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/accounts/bulk_update",
        ...args,
      });
    },
    addContactsToSequence({
      sequenceId, ...args
    }) {
      return this.makeRequest({
        method: "POST",
        path: `/emailer_campaigns/${sequenceId}/add_contact_ids`,
        ...args,
      });
    },
    searchContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts/search",
        ...args,
      });
    },
    async *getResourcesStream({
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

        page += 1;
      }
    },
  },
};
