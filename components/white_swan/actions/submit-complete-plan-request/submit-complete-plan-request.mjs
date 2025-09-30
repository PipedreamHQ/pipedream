import whiteSwan from "../../white_swan.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "white_swan-submit-complete-plan-request",
  name: "Submit Complete Plan Request",
  description: "Creates a new comprehensive quote request based on the information provided and generates the final quotation without further data requirements. [See the documentation](https://docs.whiteswan.io/partner-knowledge-base/api-documentation/action-calls/submit-complete-plan-request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whiteSwan,
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the person who the request is made on behalf of.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the person who the request is made on behalf of.",
    },
    policyType: {
      type: "string",
      label: "Policy Type",
      description: "The policy type that this request is made for.",
      options: constants.POLICY_TYPE,
    },
    mainGoal: {
      type: "string",
      label: "Main Goal",
      description: "The primary goal of this plan request, either Protection or Accumulation.",
      options: constants.MAIN_GOAL,
    },
    residentState: {
      type: "string",
      label: "Resident State",
      description: "The state in which the insured person is a resident. Example: `California`",
    },
    deathBenefitNeeded: {
      type: "integer",
      label: "Death Benefit Needed",
      description: "The amount of death benefit that is required for this plan. To opt for the lowest amount possible given a certain premium budget, use 0.",
      default: 0,
    },
    paymentSchedule: {
      type: "string",
      label: "Payment Schedule",
      description: "How often premiums should be paid on this plan.",
      options: constants.PAYMENT_SCHEDULE,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Whether the intended insured person is Male or Female.",
      options: constants.GENDER,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the intended insured person in ISO 8601 format.",
    },
    healthRating: {
      type: "string",
      label: "Health Rating",
      description: "How the insured person would rate their own general health.",
      options: constants.HEALTH_RATING,
    },
    usesTobacco: {
      type: "boolean",
      label: "Uses Tobacco",
      description: "Whether the intended insured person uses tobacco/nicotine products or not.",
    },
    insuredHeightFeet: {
      type: "integer",
      label: "Insured Height in Feet",
      description: "The height in feet of the intended insured person.",
    },
    insuredHeightInches: {
      type: "integer",
      label: "Insured Height in Inches",
      description: "The height in inches of the intended insured person.",
    },
    insuredWeight: {
      type: "integer",
      label: "Insured Weight",
      description: "The weight in pounds of the intended insured person.",
    },
    prefillInfoId: {
      type: "string",
      label: "Pre-fill Info ID",
      description: "If you have already created a pre-fill information you can pass its ID by using this parameter to associate that info with this request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whiteSwan.createQuoteRequest({
      $,
      data: {
        name: this.name,
        email: this.email,
        policy_type: this.policyType,
        main_goal: this.mainGoal,
        resident_state: this.residentState,
        death_benefit: this.deathBenefitNeeded,
        payment_schedule: this.paymentSchedule,
        gender: this.gender,
        date_of_birth: utils.convertISOToCustomFormat(this.dateOfBirth),
        health_rating: this.healthRating,
        tobacco: this.usesTobacco,
        height_feet: this.insuredHeightFeet,
        height_inches: this.insuredHeightInches,
        weight_pounds: this.insuredWeight,
        contact_id: this.prefillInfoId,
      },
    });
    $.export("$summary", "Successfully submitted complete plan request");
    return response;
  },
};
