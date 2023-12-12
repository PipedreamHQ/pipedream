import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "rex",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { result } = await this.listContacts({
          data,
        });
        return result?.rows?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    sourceId: {
      type: "string",
      label: "Source",
      description: "Identifier of a source",
      async options() {
        const { result } = await this.listSources();
        return result?.filter(({ enquiry_source_id }) => enquiry_source_id)?.map(({
          enquiry_source_id: value, email_address: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    listingId: {
      type: "string",
      label: "Listing",
      description: "Identifier of a listing",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { result } = await this.listListings({
          data,
        });
        return result?.rows?.map(({
          id: value, property,
        }) => ({
          value,
          label: `${property.adr_street_number} ${property.adr_street_name}, ${property.adr_suburb_or_town}`,
        })) || [];
      },
    },
    propertyId: {
      type: "string",
      label: "Property",
      description: "Identifier of a property",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { result } = await this.listProperties({
          data,
        });
        return result?.rows?.map(({
          id: value, system_search_key: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "Remindee",
      description: "Identifier of a user to be the remindee",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { result } = await this.listUsers({
          data,
        });
        return result?.rows?.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { result } = await this.listProjects({
          data,
        });
        return result?.rows?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectStageId: {
      type: "string",
      label: "Project Stage",
      description: "Identifier of a project stage",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { result } = await this.listProjectStages({
          data,
        });
        return result?.rows?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.${this.$auth.region === "api.uk"
        ? "uk."
        : ""}rexsoftware.com/v1/rex`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.access_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts/search",
        method: "POST",
        ...args,
      });
    },
    listSources(args = {}) {
      return this._makeRequest({
        path: "/leads/get-allowed-sources-for-account",
        method: "POST",
        ...args,
      });
    },
    listListings(args = {}) {
      return this._makeRequest({
        path: "/listings/search",
        method: "POST",
        ...args,
      });
    },
    listProperties(args = {}) {
      return this._makeRequest({
        path: "/properties/search",
        method: "POST",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/account-users/search",
        method: "POST",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects/search",
        method: "POST",
        ...args,
      });
    },
    listProjectStages(args = {}) {
      return this._makeRequest({
        path: "/project-stages/search",
        method: "POST",
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/admin-webhooks/create",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this._makeRequest({
        path: "/admin-webhooks/purge",
        method: "POST",
        ...args,
      });
    },
    createLead(args = {}) {
      return this._makeRequest({
        path: "/leads/create",
        method: "POST",
        ...args,
      });
    },
    createReminder(args = {}) {
      return this._makeRequest({
        path: "/reminders/create",
        method: "POST",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts/create",
        method: "POST",
        ...args,
      });
    },
  },
};
