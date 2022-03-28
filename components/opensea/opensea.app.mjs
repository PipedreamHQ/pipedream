import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opensea",
  propDefinitions: {},
  methods: {
    async retrieveEvents({
      $, contract, eventType, occurredAfter, cursor,
    }) {
      const apiKey = this.$auth.api_key;
      return axios($ ?? this, {
        url: "https://api.opensea.io/api/v1/events",
        params: {
          only_opensea: false,
          asset_contract_address: contract,
          event_type: eventType,
          occurred_after: occurredAfter,
          cursor,
        },
        headers: {
          "X-API-KEY": apiKey,
        },
      });
    },
  },
};
