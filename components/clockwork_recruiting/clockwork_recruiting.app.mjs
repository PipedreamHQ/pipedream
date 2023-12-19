import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "clockwork_recruiting",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company Id",
      description: "The id of the company where the position is open.",
      async options({ page }) {
        const { companies } = await this.listCompanies({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
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
    personId: {
      type: "string",
      label: "Person Id",
      description: "The id of the person you want to use.",
      async options({ page }) {
        const { people } = await this.listPeople({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });

        return people.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    regionId: {
      type: "string",
      label: "Region Id",
      description: "The address' region",
      async options({ page }) {
        const { regions } = await this.listRegions({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });

        return regions.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "A list of tag names.",
      async options({ page }) {
        const { tags } = await this.listTags({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });

        return tags.map(({ name }) => name);
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag Ids",
      description: "A list of tag Ids.",
      async options({ page }) {
        const { tags } = await this.listTags({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
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
  },
  methods: {
    _firmName() {
      return this.$auth.firm_name;
    },
    _firmServiceKey() {
      return this.$auth.firm_service_key;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiSecret() {
      return this.$auth.api_secret;
    },
    _apiUrl() {
      return `https://api.clockworkrecruiting.com/v3.0/${this._firmName()}`;
    },
    _getHeaders() {
      const auth_hash = Buffer.from(`${this._apiKey()}:${this._apiSecret()}`).toString("base64");
      return {
        "Authorization": `Token ${auth_hash}`,
        "X-API-Key": this._firmServiceKey(),
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    addPersonTag({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `people/${personId}/tags`,
        ...args,
      });
    },
    createAddress({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `people/${personId}/addresses`,
        ...args,
      });
    },
    createEmail({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `people/${personId}/email_addresses`,
        ...args,
      });
    },
    createLinkedinUrl({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `people/${personId}/linkedin_urls`,
        ...args,
      });
    },
    createPerson(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "people",
        ...args,
      });
    },
    createPhoneNumber({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `people/${personId}/phone_numbers`,
        ...args,
      });
    },
    createPosition({
      personId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `people/${personId}/positions`,
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "companies",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this._makeRequest({
        path: "people",
        ...args,
      });
    },
    listRegions(args = {}) {
      return this._makeRequest({
        path: "regions",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "tags",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${hookId}`,
      });
    },
  },
};
