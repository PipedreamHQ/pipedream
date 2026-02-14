import app from "../../paykickstart.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "paykickstart-create-purchase",
  name: "Create Purchase",
  description: "Creates a new purchase transaction. [See the documentation](https://docs.paykickstart.com/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    product: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    plan: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Buyer's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Buyer's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Buyer's email address",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of the product being purchased. NOTE: The charge amount will be calculated by multiplying the price and quantity fields before adding tax, shipping etc. If the product's is `0` then don't set this field.",
      optional: true,
    },
    price: {
      type: "integer",
      label: "Price",
      description: "Override the product's price amount for this purchase. If this field is not set, the price from the product's settings is used.",
      optional: true,
    },
    isRecurring: {
      type: "boolean",
      label: "Is Recurring",
      description: "Enable a subscription-based product purchase. This field is not required unless you are setting up the purchase to be a subscription (see fields below).",
      optional: true,
    },
    recurringFreq: {
      type: "integer",
      label: "Recurring Frequency",
      description: "The number of **Recurring Frequency Type** units. If `2` and a **Recurring Frequency Type** is `months`, means the subscription will charge every 2 months. This field is required when **Is Recurring** is set.",
      optional: true,
    },
    recurringFreqType: {
      type: "string",
      label: "Recurring Frequency Type",
      description: "The recurring period for the recurring payment. This field is required when **Is Recurring** is set.",
      options: constants.FREQUENCY_TYPES,
      optional: true,
    },
    cycles: {
      type: "string",
      label: "Cycles",
      description: "The number of payments for your subscription. Set as null for an infinite subscription. This field is required when **Is Recurring** is set.",
      optional: true,
    },
    hasTrial: {
      type: "boolean",
      label: "Has Trial",
      description: "Enable trial period for the purchase. Please note this is only currently possible for recurring subscription products. This field is not required unless you which to create a trial period for your product.",
      optional: true,
    },
    trialAmount: {
      type: "string",
      label: "Trial Amount",
      description: "The initial amount to charge for the trial. Amount may be set to `0` for free trial. This field is not required unless you have **Has Trial** enabled.",
      optional: true,
    },
    trialDays: {
      type: "integer",
      label: "Trial Days",
      description: "The number of days before the subscription transactions begin. For example, if you want to set a 14 day free trial, make sure the product is set to recurring in its settings or via the API, then set **Trial Amoun** to `0` and **Trial Days** to `14`. This field is not required unless you have **Has Trial** enabled.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      product,
      plan,
      firstName,
      lastName,
      email,
      price,
      quantity,
      isRecurring,
      recurringFreq,
      recurringFreqType,
      cycles,
      hasTrial,
      trialAmount,
      trialDays,
    } = this;

    const response = await app.createPurchase({
      $,
      data: {
        product,
        plan,
        first_name: firstName,
        last_name: lastName,
        email,
        price,
        quantity,
        is_recurring: isRecurring,
        recurring_freq: recurringFreq,
        recurring_freq_type: recurringFreqType,
        cycles,
        has_trial: hasTrial,
        trial_amount: trialAmount,
        trial_days: trialDays,
      },
    });

    $.export("$summary", "Successfully created purchase");
    return response;
  },
};
