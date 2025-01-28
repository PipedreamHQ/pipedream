import common from "./webhook.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    metafieldNamespaces: {
      type: "string[]",
      label: "Metafield Namespaces",
      description: "Array of namespaces for any metafields that should be included with each webhook. Metafield definitions can be found in your store's Settings -> Custom Data. Select a metafield to view its namespace under \"Namespace and key\". For example, if the value is `custom.test_metafield`, the namespace is `custom`.",
      optional: true,
    },
    privateMetafieldNamespaces: {
      type: "string[]",
      label: "Private Metafield Namespaces",
      description: "Array of namespaces for any private metafields that should be included with each webhook. Metafield definitions can be found in your store's Settings -> Custom Data. Select a metafield to view its namespace under \"Namespace and key\". For example, if the value is `custom.test_metafield`, the namespace is `custom`.",
      optional: true,
    },
  },
};
