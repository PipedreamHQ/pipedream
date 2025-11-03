import paigo from "../../paigo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "paigo-create-offering",
  name: "Create Offering",
  description: "Creates a new offering in the Paigo platform. [See the documentation](http://www.api.docs.paigo.tech/#tag/Offerings/operation/Create%20an%20offering)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paigo,
    offeringName: {
      type: "string",
      label: "Offering Name",
      description: "A friendly, human-readable name for the offering.",
    },
    dimensionIds: {
      propDefinition: [
        paigo,
        "dimensionId",
      ],
      type: "string[]",
      label: "Dimension IDs",
      description: "Array of the identifier of the dimensions that this offering contains. Dimensions specify the type of usage that is being billed for.",
      optional: true,
    },
    offeringVisibility: {
      type: "string",
      label: "Offering Visibility",
      description: "The visibility of the offering, specifically if its private or public. Public offerings are designed to be shared among customers. Private offerings are typically used for enterprise deals which contain discounts or prepaid credits.",
      options: constants.OFFERING_VISIBILITY,
      default: "public",
      optional: true,
    },
    offeringType: {
      type: "string",
      label: "Offering Type",
      description: "The type of offering",
      options: constants.OFFERING_TYPE,
      optional: true,
    },
    billingCycle: {
      type: "string",
      label: "Billing Cycle",
      description: "The time frame when an automatic bill should be sent. Leave empty for no automated billing",
      options: constants.BILLING_CYCLE,
      optional: true,
    },
    subscriptionPrice: {
      type: "string",
      label: "SubscriptionPrice",
      description: "The price of the subscription. Only positive number string is allowed. Only required if `offeringType` is `subscription`.",
      optional: true,
    },
    freeTrialLength: {
      type: "string",
      label: "Free Trial Length",
      description: "The length of time for a free trial. This is a number of days. Only positive number string is allowed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paigo.createOffering({
      $,
      data: {
        offeringName: this.offeringName,
        dimensionIds: this.dimensionIds || [],
        offeringVisibility: this.offeringVisibility,
        offeringType: this.offeringType,
        billingCycle: this.billingCycle,
        subscriptionPrice: this.subscriptionPrice,
        freeTrialLength: this.freeTrialLength,
      },
    });
    $.export("$summary", `Successfully created offering with ID: ${response.offeringId}`);
    return response;
  },
};
