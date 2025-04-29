import queries from "../../common/queries.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  methods: {
    getMetaobject({ id }) {
      return this.shopify._makeGraphQlRequest(queries.GET_METAOBJECT, {
        id,
      });
    },
    createMetaobject({
      type, fields,
    }) {
      return this.shopify._makeGraphQlRequest(mutations.CREATE_METAOBJECT, {
        metaobject: {
          type,
          capabilities: {
            publishable: {
              status: "ACTIVE",
            },
          },
          fields,
        },
      });
    },
    updateMetaobject({
      id, fields,
    }) {
      return this.shopify._makeGraphQlRequest(mutations.UPDATE_METAOBJECT, {
        id,
        metaobject: {
          fields,
        },
      });
    },
  },
};
