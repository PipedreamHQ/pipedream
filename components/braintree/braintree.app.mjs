import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "braintree",
  propDefinitions: {},
  methods: {
    makeGraphQLRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "post",
        url: `https://${this.$auth.environment}.braintree-api.com/graphql`,
        headers: {
          "Braintree-Version": "2019-01-01",
          "Content-Type": "application/json",
        },
        auth: {
          username: `${this.$auth.public_key}`,
          password: `${this.$auth.private_key}`,
        },
        ...opts,
      });
    },
  },
};
