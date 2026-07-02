import apexverify from "../../apexverify.app.mjs";
import {
  COUNTRY_OPTIONS,
  TARGET_AUDIENCE_OPTIONS,
  TARGET_MARKET_INDUSTRY_OPTIONS,
  TARGET_OBJECTIVE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "apexverify-unit-verification",
  name: "ApexVerify - Email/Phone B2B Data Verification",
  description: "Verify a single email address or phone number using ApexVerify. [See the documentation](https://documentation.apexverify.com/api-reference/apex-verify-api/unit)",
  version: "0.0.1",
  type: "action",
  props: {
    apexverify,

    type: {
      type: "string",
      label: "Data Type",
      description: "Which kind of contact data is being verified. Allowed values: `email` (verify an email address) or `phone` (verify a phone number). The value of `unit` must match this type — pass `email` here when `unit` is an email address, and `phone` when `unit` is a phone number.",
      options: [
        {
          label: "Email Address",
          value: "email",
        },
        {
          label: "Phone Number",
          value: "phone",
        },
      ],
    },
    unit: {
      type: "string",
      label: "Email or Phone to Verify",
      description: "The single email address or phone number to verify. Format must match `type`: for `type=email`, pass a full RFC 5322 email like `jane.doe@example.com`. For `type=phone`, pass a number in E.164 format with the leading `+` and country code — e.g. `+14155552671` (US) or `+442071234567` (UK). Hyphens and spaces are tolerated but not required. Only one address/number per call.",
    },
    targetCountry: {
      type: "string",
      label: "Target Country",
      description: "Country against which the email or phone should be processed.",
      default: "US",
      options: COUNTRY_OPTIONS,
    },
    targetAudience: {
      type: "string",
      label: "Target Audience",
      description: "Optional target audience context for the verification. Accepted values include `1` for Agency / Consultants, `4` for Developers & Technical Leads, `8` for Founders & C-Level Executives, and `17` for Marketing & Sales Professionals.",
      optional: true,
      options: TARGET_AUDIENCE_OPTIONS,
    },
    targetMarketIndustry: {
      type: "string",
      label: "Target Market Industry",
      description: "Optional market industry context for the verification. Accepted values include `18` for Construction, `29` for Finance and Insurance, `42` for Health Care and Social Assistance, `46` for Information, and `91` for Retail Trade.",
      optional: true,
      options: TARGET_MARKET_INDUSTRY_OPTIONS,
    },
    targetObjective: {
      type: "string",
      label: "Target Objective",
      description: "Optional campaign or business objective context for the verification. Accepted values include `4` for Customer Acquisition / Sales, `6` for Lead Generation (Top/Mid-Funnel), `12` for Sales-Ready Leads, and `16` for Website / App Traffic Acquisition.",
      optional: true,
      options: TARGET_OBJECTIVE_OPTIONS,
    },
    useAccountCache: {
      type: "boolean",
      label: "Use Account Cache",
      description: "Use previous verification results from your ApexVerify account cache when available.",
      optional: true,
      default: true,
    },
    maxAccountCacheBackoff: {
      type: "integer",
      label: "Max Account Cache Backoff",
      description: "Maximum number of days to look back in account cache. Min: 1. Max: 180.",
      optional: true,
      default: 30,
    },
    useGlobalCache: {
      type: "boolean",
      label: "Use Global Cache",
      description: "Use anonymized global cache results when available.",
      optional: true,
      default: true,
    },
    maxGlobalCacheBackoff: {
      type: "integer",
      label: "Max Global Cache Backoff",
      description: "Maximum number of days to look back in global cache. Min: 1. Max: 180.",
      optional: true,
      default: 30,
    },
  },
  annotations: {
    openWorldHint: true,
    readOnlyHint: false,
    destructiveHint: false,
  },

  async run({ $ }) {
    const payload = {
      type: this.type,
      target_country: this.targetCountry,
      unit: this.unit,
      target_audience: this.targetAudience,
      target_market_industry: this.targetMarketIndustry,
      target_objective: this.targetObjective,
      use_account_cache: this.useAccountCache,
      max_account_cache_backoff: this.maxAccountCacheBackoff,
      use_global_cache: this.useGlobalCache,
      max_global_cache_backoff: this.maxGlobalCacheBackoff,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    const response = await this.apexverify.verifyUnit($, payload);

    $.export("$summary", `Successfully verified ${this.type}`);

    return response;
  },
};
