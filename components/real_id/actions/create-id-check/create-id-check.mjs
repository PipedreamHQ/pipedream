import app from "../../real_id.app.mjs";

export default {
  key: "real_id-create-id-check",
  name: "Create ID Check",
  description: "Create a new ID check for a user. [See the documentation](https://getverdict.com/help/docs/api/checks#create-an-id-check).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Either the **Email** or the **Phone** number is required to create an ID check.",
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the customer",
      optional: true,
    },
    wooCommerceCustomerId: {
      type: "string",
      label: "WooCommerce Customer ID",
      description: "Unique identifier for the customer in WooCommerce",
      optional: true,
    },
    wooCommerceOrderId: {
      type: "string",
      label: "WooCommerce Order ID",
      description: "Unique identifier for the order in WooCommerce",
      optional: true,
    },
    shopifyAdminGraphqlId: {
      type: "string",
      label: "Shopify Admin GraphQL ID",
      description: "Unique identifier for the customer in Shopify",
      optional: true,
    },
    shopifyAdminGraphqlOrderId: {
      type: "string",
      label: "Shopify Admin GraphQL Order ID",
      description: "Unique identifier for the order in Shopify",
      optional: true,
    },
    shopifyAdminGraphqlOrderName: {
      type: "string",
      label: "Shopify Admin GraphQL Order Name",
      description: "Name of the order in Shopify",
      optional: true,
    },
    additionalParameters: {
      type: "object",
      label: "Additional Parameters",
      description: "Additional parameters to include in the request",
      optional: true,
    },
  },
  methods: {
    createIdCheck(args = {}) {
      return this.app.post({
        path: "/checks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createIdCheck,
      email,
      phone,
      firstName,
      lastName,
      wooCommerceCustomerId,
      wooCommerceOrderId,
      shopifyAdminGraphqlId,
      shopifyAdminGraphqlOrderId,
      shopifyAdminGraphqlOrderName,
      additionalParameters,
    } = this;

    const response = await createIdCheck({
      $,
      data: {
        customer: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          wc_id: wooCommerceCustomerId,
          shopify_admin_graphql_id: shopifyAdminGraphqlId,
        },
        order: {
          wc_id: wooCommerceOrderId,
          shopify_admin_graphql_id: shopifyAdminGraphqlOrderId,
          name: shopifyAdminGraphqlOrderName,
        },
        ...additionalParameters,
      },
    });
    $.export("$summary", "Successfully created ID check.");
    return response;
  },
};
