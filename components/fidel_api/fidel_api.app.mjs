import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fidel_api",
  propDefinitions: {
    programId: {
      type: "string",
      label: "Program ID",
      description: "The unique identifier for a program.",
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The unique identifier for a card.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "ISO 3166-1 alpha-3 country code where the card was issued.",
      options: [
        "CAN",
        "DNK",
        "FIN",
        "GBR",
        "IRL",
        "JPN",
        "NOR",
        "SWE",
        "USA",
      ],
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
      description: "The card's expiry year.",
    },
    number: {
      type: "string",
      label: "Card Number",
      description: "The card number.",
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
    url: {
      type: "string",
      label: "URL",
      description: "The URL destination for the webhook event.",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The type of event for the webhook.",
      options: [
        {
          label: "Card Linked",
          value: "card.linked",
        },
        {
          label: "Transaction Authorized",
          value: "transaction.auth",
        },
      ],
    },
    offerId: {
      type: "string",
      label: "Offer ID",
      description: "The offer ID to filter qualified auth and clearing transactions by offer.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fidel.uk/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Fidel-Key": this.$auth.oauth_access_token,
        },
      });
    },
    async createWebhook({
      programId, eventName, url, offerId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/programs/${programId}/hooks`,
        data: {
          event: eventName,
          url,
          offerId,
        },
      });
    },
    async createProgram({
      name, icon, iconBackground, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/programs",
        data: {
          name,
          icon,
          iconBackground,
          metadata,
        },
      });
    },
    async createCard({
      programId, countryCode, expMonth, expYear, number, termsOfUse, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/programs/${programId}/cards`,
        data: {
          countryCode,
          expMonth,
          expYear,
          number,
          termsOfUse,
          metadata,
        },
      });
    },
    async deleteCard({ cardId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/cards/${cardId}`,
      });
    },
    async listCards({
      programId, limit, start, order,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/programs/${programId}/cards`,
        params: {
          limit,
          start,
          order,
        },
      });
    },
    async listPrograms({
      limit, start, order,
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/programs",
        params: {
          limit,
          start,
          order,
        },
      });
    },
  },
};
