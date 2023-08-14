import { axios } from "@pipedream/platform";

export default {
  methods: {
    async makeGraphQLRequest({
      $ = this, ...args
    }) {
      return axios($, {
        url: `https://${this.shopify.getShopId()}.myshopify.com/admin/api/2023-04/graphql.json`,
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": `${this.shopify.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    formatFields(fields) {
      return JSON.stringify(fields).replace(new RegExp("\"key\"", "g"), "key")
        .replace(new RegExp("\"value\"", "g"), "value");
    },
    getMetaobject({
      id, $,
    }) {
      return this.makeGraphQLRequest({
        data: {
          query: `query {
            metaobject(id: "${id}") {
              id
              handle
              type
              displayName
              updatedAt
              fields {
                key
                type
                value
                definition {
                  name
                }
              }
            }
          }`,
        },
        $,
      });
    },
    listMetaobjects({
      type, $,
    }) {
      return this.makeGraphQLRequest({
        data: {
          query: `query {
            metaobjects(type: "${type}", first: 100) {
              nodes {
                id
                handle
                type
                displayName
                updatedAt
                fields {
                  key
                  type
                  value
                }
              }
            }
          }`,
        },
        $,
      });
    },
    listMetaobjectDefinitions({ $ } = {}) {
      return this.makeGraphQLRequest({
        data: {
          query: `query {
            metaobjectDefinitions(first: 100) {
              nodes {
                id
                name
                type
                fieldDefinitions {
                  key
                  type {
                    name
                  }
                  name
                }
              }
            }
          }`,
        },
        $,
      });
    },
    createMetaobject({
      type, fields, $,
    }) {
      return this.makeGraphQLRequest({
        data: {
          query: `mutation metaobjectCreate {
            metaobjectCreate(metaobject: {
              type: "${type}",
              capabilities: {
                publishable: {
                  status: ACTIVE
                }
              }
              fields: ${this.formatFields(fields)}
            }) {
              metaobject {
                id
                handle
                type
              }
              userErrors {
                field
                message
              }
            }
          }`,
        },
        $,
      });
    },
    updateMetaobject({
      id, fields, $,
    }) {
      return this.makeGraphQLRequest({
        data: {
          query: `mutation metaobjectUpdate {
            metaobjectUpdate(id: "${id}", metaobject: { fields: ${this.formatFields(fields)} }) {
              metaobject {
                id
                type
              }
              userErrors {
                field
                message
              }
            }
          }`,
        },
        $,
      });
    },
  },
};
