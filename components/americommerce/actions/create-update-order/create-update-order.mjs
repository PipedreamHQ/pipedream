import { ConfigurationError } from "@pipedream/platform";
import app from "../../americommerce.app.mjs";

export default {
  key: "americommerce-create-update-order",
  name: "Create Or Update Order",
  description: "Creates a new order or updates an existing one. [See the documentation here](https://developers.cart.com/docs/rest-api/3f2ab73188031-create-an-order) and [here](https://developers.cart.com/docs/rest-api/e2649bb3adba9-update-an-order).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    customerId: {
      optional: true,
      propDefinition: [
        app,
        "customerId",
      ],
    },
    orderStatusId: {
      propDefinition: [
        app,
        "orderStatusId",
      ],
    },
    orderShippingAddressId: {
      label: "Order Shipping Address ID",
      description: "The ID of the order's shipping address.",
      propDefinition: [
        app,
        "orderAddressId",
      ],
    },
    orderBillingAddressId: {
      label: "Order Billing Address ID",
      description: "The ID of the order's billing address.",
      propDefinition: [
        app,
        "orderAddressId",
      ],
    },
    customerTypeId: {
      propDefinition: [
        app,
        "customerTypeId",
      ],
    },
    specialInstructions: {
      type: "string",
      label: "Special Instructions",
      description: "Special instructions for the order.",
      optional: true,
    },
    subtotal: {
      type: "string",
      label: "Subtotal",
      description: "The subtotal of the order.",
      optional: true,
    },
    taxTotal: {
      type: "string",
      label: "Tax Total",
      description: "The total tax for the order or tax added to the order.",
      optional: true,
    },
    shippingTotal: {
      type: "string",
      label: "Shipping Total",
      description: "The total shipping cost for the order or shipping added to the order.",
      optional: true,
    },
    discountTotal: {
      type: "string",
      label: "Discount Total",
      description: "The total discount for the order.",
      optional: true,
    },
    grandTotal: {
      type: "string",
      label: "Grand Total",
      description: "The grand total of the order.",
      optional: true,
    },
    costTotal: {
      type: "string",
      label: "Cost Total",
      description: "The total cost of the order.",
      optional: true,
    },
    selectedShippingMethod: {
      label: "Selected Shipping Method",
      description: "The selected shipping method for the order.",
      propDefinition: [
        app,
        "shippingMethodId",
        () => ({
          mapper: ({
            shipping_method_id: value,
            shipping_method: label,
          }) => ({
            label,
            value: String(value),
          }),
        }),
      ],
    },
    referrer: {
      type: "string",
      label: "Referrer",
      description: "The referrer for the order.",
      optional: true,
    },
    adminComments: {
      type: "string",
      label: "Admin Comments",
      description: "Comments from the admin about the order.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the order.",
      optional: true,
    },
    searchPhrase: {
      type: "string",
      label: "Search Phrase",
      description: "The search phrase for the order.",
      optional: true,
    },
    storeId: {
      propDefinition: [
        app,
        "storeId",
      ],
    },
    isPpc: {
      type: "boolean",
      label: "Is PPC",
      description: "Whether the order is a PPC order.",
      optional: true,
    },
    ppcKeyword: {
      type: "string",
      label: "PPC Keyword",
      description: "The PPC keyword for the order.",
      optional: true,
    },
    handlingTotal: {
      type: "string",
      label: "Handling Total",
      description: "The handling total for the order.",
      optional: true,
    },
    isPaymentOrderOnly: {
      type: "boolean",
      label: "Is Payment Order Only",
      description: "Whether the order is a payment order only.",
      optional: true,
    },
    selectedShippingProviderService: {
      type: "string",
      label: "Selected Shipping Provider Service",
      description: "The selected shipping provider service for the order.",
      optional: true,
    },
    additionalFees: {
      type: "string",
      label: "Additional Fees",
      description: "Additional fees for the order.",
      optional: true,
    },
    adcodeId: {
      propDefinition: [
        app,
        "adcodeId",
      ],
    },
    isGift: {
      type: "boolean",
      label: "Is Gift",
      description: "Whether the order is a gift.",
      optional: true,
    },
    giftMessage: {
      type: "string",
      label: "Gift Message",
      description: "The gift message for the order.",
      optional: true,
    },
    publicComments: {
      type: "string",
      label: "Public Comments",
      description: "Public comments about the order.",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Instructions for the order.",
      optional: true,
    },
    sourceGroup: {
      type: "string",
      label: "Source Group",
      description: "The source group for the order.",
      optional: true,
    },
    fromSubscriptionId: {
      label: "From Subscription ID",
      description: "The ID of the subscription.",
      propDefinition: [
        app,
        "subscriptionId",
      ],
    },
    discountedShippingTotal: {
      type: "string",
      label: "Discounted Shipping Total",
      description: "The discounted shipping total for the order.",
      optional: true,
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number.",
      optional: true,
    },
    couponCode: {
      type: "string",
      label: "Coupon Code",
      description: "The coupon code for the order.",
      optional: true,
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "The type of order.",
      optional: true,
    },
    expires: {
      type: "boolean",
      label: "Expires",
      description: "Whether the order expires.",
      optional: true,
    },
    campaignCode: {
      type: "string",
      label: "Campaign Code",
      description: "The campaign code for the order.",
      optional: true,
    },
    rewardPointsCredited: {
      type: "boolean",
      label: "Reward Points Credited",
      description: "Whether the reward points are credited.",
      optional: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel for the order.",
      optional: true,
      options: [
        "Online",
        "InStore",
        "Chat",
        "Phone",
        "Email",
      ],
    },
    device: {
      type: "string",
      label: "Device",
      description: "The device for the order.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the order. Eg. `2021-05-14`",
      optional: true,
    },
  },
  methods: {
    createOrder(args = {}) {
      return this.app.post({
        path: "/orders",
        ...args,
      });
    },
    updateOrder({
      orderId, ...args
    } = {}) {
      return this.app.put({
        path: `/orders/${orderId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createOrder,
      updateOrder,
      orderId,
      customerId,
      orderStatusId,
      orderShippingAddressId,
      orderBillingAddressId,
      customerTypeId,
      specialInstructions,
      subtotal,
      taxTotal,
      shippingTotal,
      discountTotal,
      grandTotal,
      costTotal,
      selectedShippingMethod,
      referrer,
      adminComments,
      source,
      searchPhrase,
      storeId,
      isPpc,
      ppcKeyword,
      handlingTotal,
      isPaymentOrderOnly,
      selectedShippingProviderService,
      additionalFees,
      adcodeId,
      isGift,
      giftMessage,
      publicComments,
      instructions,
      sourceGroup,
      fromSubscriptionId,
      discountedShippingTotal,
      orderNumber,
      couponCode,
      orderType,
      expires,
      campaignCode,
      rewardPointsCredited,
      channel,
      device,
      dueDate,
    } = this;

    const isCreate = !orderId;

    if (
      isCreate
        && (
          !customerId
          || !orderStatusId
          || !orderShippingAddressId
          || !orderBillingAddressId
          || !taxTotal
          || !shippingTotal
        )
    ) {
      throw new ConfigurationError("The **Customer ID**, **Order Status ID**, **Order Shipping Address ID**, **Order Billing Address ID**, **Tax Total**, and **Shipping Total** are required to create a new order.");
    }

    const data = {
      customer_id: customerId,
      order_status_id: orderStatusId,
      order_shipping_address_id: orderShippingAddressId,
      order_billing_address_id: orderBillingAddressId,
      customer_type_id: customerTypeId,
      special_instructions: specialInstructions,
      subtotal,
      tax_total: taxTotal,
      shipping_total: shippingTotal,
      discount_total: discountTotal,
      grand_total: grandTotal,
      cost_total: costTotal,
      selected_shipping_method: selectedShippingMethod,
      referrer,
      admin_comments: adminComments,
      source,
      search_phrase: searchPhrase,
      store_id: storeId,
      is_ppc: isPpc,
      ppc_keyword: ppcKeyword,
      handling_total: handlingTotal,
      is_payment_order_only: isPaymentOrderOnly,
      selected_shipping_provider_service: selectedShippingProviderService,
      additional_fees: additionalFees,
      adcode_id: adcodeId,
      is_gift: isGift,
      gift_message: giftMessage,
      public_comments: publicComments,
      instructions,
      source_group: sourceGroup,
      from_subscription_id: fromSubscriptionId,
      discounted_shipping_total: discountedShippingTotal,
      order_number: orderNumber,
      coupon_code: couponCode,
      order_type: orderType,
      expires,
      campaign_code: campaignCode,
      reward_points_credited: rewardPointsCredited,
      channel,
      device,
      due_date: dueDate,
    };

    if (isCreate) {
      const response = await createOrder({
        $,
        data,
      });
      $.export("$summary", `Successfully created the order with ID \`${response.id}\`.`);
      return response;
    }

    const response = await updateOrder({
      $,
      orderId,
      data,
    });
    $.export("$summary", `Successfully updated the order with ID \`${response.id}\`.`);
    return response;
  },
};
