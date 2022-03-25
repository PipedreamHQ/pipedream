import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opensea",
  propDefinitions: {},
  methods: {
    async retrieveEvents({
      $, contract, eventType,
    }) {
      const apiKey = this.$auth.api_key;
      const url = `https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=${contract}&event_type=${eventType}`;
      return axios($ ?? this, {
        url,
        headers: {
          "X-API-KEY": apiKey,
        },
      });
    },
  },
};
