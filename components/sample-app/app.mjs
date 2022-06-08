import graphql from 'graphql'
import graphqlRequest from 'graphql-request'

export default {
  name: "Source Demo",
  description: "This is a demo source",
  async run() {
    console.log('graphql', graphql)
    console.log('graphqlRequest', graphqlRequest)

    const endpoint = `https://partners.shopify.com/1/api/2021-04/graphql.json`;
    const graphqlClient = new graphqlRequest.GraphQLClient(endpoint, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": 'abc',
      },
    })
    console.log('graphqlRequest Client', graphqlClient)

    this.$emit({ message: "hello world!" });
  },
};
