import { axios } from "@pipedream/platform";
import {
  COUNTRY_CODE_OPTIONS, LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "fidel_api",
  propDefinitions: {
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The unique identifier for a card.",
      async options({
        start = null, programId,
      }) {
        const {
          items, last,
        } = await this.listCards({
          programId,
          params: {
            limit: LIMIT,
            start,
            order: "desc",
          },
        });

        return  {
          options: items.map(({
            id: value, firstNumbers, lastNumbers,
          }) => ({
            label: `${firstNumbers}****${lastNumbers}`,
            value,
          })),
          context: {
            start: encodeURIComponent(JSON.stringify(last)),
          },
        };
      },
    },
    programId: {
      type: "string",
      label: "Program ID",
      description: "The unique identifier for a program.",
      async options({ start = null }) {
        const {
          items, last,
        } = await this.listPrograms({
          params: {
            limit: LIMIT,
            start,
            order: "desc",
          },
        });

        return  {
          options: items.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            start: encodeURIComponent(JSON.stringify(last)),
          },
        };
      },
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "ISO 3166-1 alpha-3 country code where the card was issued.",
      options: COUNTRY_CODE_OPTIONS,
    },
    expMonth: {
      type: "integer",
      label: "Expiry Month",
      description: "The card's expiry month (1-12).",
      min: 1,
      max: 12,
    },
    expYear: {
      type: "integer",
      label: "Expiry Year",
      description: "The expiration year must fulfill the following criteria: CurrentYear <= ExpYear <= CurrentYear + 19.",
    },
    number: {
      type: "string",
      label: "Card Number",
      description: "15-16 long card number.",
    },
    termsOfUse: {
      type: "boolean",
      label: "Terms of Use",
      description: "Whether the user has agreed to the terms of use.",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata related to the card, program, or transaction.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fidel.uk/v1";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Fidel-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createProgram(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/programs",
        ...opts,
      });
    },
    createCard({
      programId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/programs/${programId}/cards`,
        ...opts,
      });
    },
    createHook({
      programId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/programs/${programId}/hooks`,
        ...opts,
      });
    },
    deleteCard({ cardId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/cards/${cardId}`,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
      });
    },
    listCards(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/cards",
        ...opts,
      });
    },
    listPrograms(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/programs",
        ...opts,
      });
    },
  },
};
