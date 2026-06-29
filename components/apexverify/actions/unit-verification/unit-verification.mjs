import apexverify from "../../apexverify.app.mjs";

const countryOptions = [
  {
    label: "United States (US)",
    value: "US",
  },
  {
    label: "France (FR)",
    value: "FR",
  },
  {
    label: "United Kingdom (GB)",
    value: "GB",
  },
  {
    label: "Canada (CA)",
    value: "CA",
  },
  {
    label: "Germany (DE)",
    value: "DE",
  },
  {
    label: "Italy (IT)",
    value: "IT",
  },
  {
    label: "Spain (ES)",
    value: "ES",
  },
  {
    label: "India (IN)",
    value: "IN",
  },
  {
    label: "Brazil (BR)",
    value: "BR",
  },
  {
    label: "Australia (AU)",
    value: "AU",
  },
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AR",
  "AS",
  "AT",
  "AW",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BT",
  "BW",
  "BY",
  "BZ",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CY",
  "CZ",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "ER",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FO",
  "GA",
  "GD",
  "GE",
  "GG",
  "GH",
  "GI",
  "GL",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GW",
  "GY",
  "HK",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IO",
  "IQ",
  "IR",
  "IS",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KM",
  "KN",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SI",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TG",
  "TH",
  "TJ",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "UY",
  "UZ",
  "VC",
  "VE",
  "VG",
  "VN",
  "VU",
  "WS",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
];

const targetAudienceOptions = [
  {
    label: "Agency / Consultants",
    value: "1",
  },
  {
    label: "Creators & Influencers",
    value: "2",
  },
  {
    label: "Customer Support & Success",
    value: "3",
  },
  {
    label: "Developers & Technical Leads",
    value: "4",
  },
  {
    label: "E-commerce & Retail Managers",
    value: "5",
  },
  {
    label: "Enterprise Decision-Makers",
    value: "6",
  },
  {
    label: "Finance & Operations Professionals",
    value: "7",
  },
  {
    label: "Founders & C-Level Executives",
    value: "8",
  },
  {
    label: "Freelancers & Solopreneurs",
    value: "9",
  },
  {
    label: "Government & Public Sector Employees",
    value: "10",
  },
  {
    label: "HR & Talent Acquisition",
    value: "11",
  },
  {
    label: "Healthcare Professionals",
    value: "12",
  },
  {
    label: "Hobbyists & Enthusiasts",
    value: "13",
  },
  {
    label: "Investors & VCs",
    value: "14",
  },
  {
    label: "Job Seekers",
    value: "15",
  },
  {
    label: "Legal Professionals",
    value: "16",
  },
  {
    label: "Marketing & Sales Professionals",
    value: "17",
  },
  {
    label: "Non-Profit Leaders & Staff",
    value: "18",
  },
  {
    label: "Parents & Families",
    value: "19",
  },
  {
    label: "Product & Project Managers",
    value: "20",
  },
  {
    label: "Real Estate Professionals",
    value: "21",
  },
  {
    label: "Small-to-Medium Business (SMB) Owners",
    value: "22",
  },
  {
    label: "Students & Educators",
    value: "23",
  },
];

const targetMarketIndustryOptions = [
  {
    label: "Accommodation",
    value: "1",
  },
  {
    label: "Accommodation and Food Services",
    value: "2",
  },
  {
    label: "Administrative and Support Services",
    value: "3",
  },
  {
    label: "Administrative/Support, Waste Management",
    value: "4",
  },
  {
    label: "Agriculture, Forestry, Fishing and Hunting",
    value: "5",
  },
  {
    label: "Air Transportation",
    value: "6",
  },
  {
    label: "Ambulatory Health Care Services",
    value: "7",
  },
  {
    label: "Amusement, Gambling, and Recreation",
    value: "8",
  },
  {
    label: "Animal Production",
    value: "9",
  },
  {
    label: "Apparel Manufacturing",
    value: "10",
  },
  {
    label: "Arts, Entertainment, and Recreation",
    value: "11",
  },
  {
    label: "Beverage & Tobacco Mfg",
    value: "12",
  },
  {
    label: "Broadcasting (except Internet)",
    value: "13",
  },
  {
    label: "Building Material & Garden Dealers",
    value: "14",
  },
  {
    label: "Chemical Manufacturing",
    value: "15",
  },
  {
    label: "Clothing and Accessories Stores",
    value: "16",
  },
  {
    label: "Computer and Electronic Product Mfg",
    value: "17",
  },
  {
    label: "Construction",
    value: "18",
  },
  {
    label: "Construction of Buildings",
    value: "19",
  },
  {
    label: "Couriers and Messengers",
    value: "20",
  },
  {
    label: "Credit Intermediation",
    value: "21",
  },
  {
    label: "Crop Production",
    value: "22",
  },
  {
    label: "Data Processing & Hosting",
    value: "23",
  },
  {
    label: "Education and Health Services",
    value: "24",
  },
  {
    label: "Educational Services",
    value: "25",
  },
  {
    label: "Electrical Equipment Mfg",
    value: "26",
  },
  {
    label: "Electronics and Appliance Stores",
    value: "27",
  },
  {
    label: "Fabricated Metal Product Mfg",
    value: "28",
  },
  {
    label: "Finance and Insurance",
    value: "29",
  },
  {
    label: "Financial Activities",
    value: "30",
  },
  {
    label: "Fishing, Hunting and Trapping",
    value: "31",
  },
  {
    label: "Food Manufacturing",
    value: "32",
  },
  {
    label: "Food Services and Drinking Places",
    value: "33",
  },
  {
    label: "Food and Beverage Stores",
    value: "34",
  },
  {
    label: "Forestry and Logging",
    value: "35",
  },
  {
    label: "Funds, Trusts, & Financial Vehicles",
    value: "36",
  },
  {
    label: "Furniture and Home Furnishings Stores",
    value: "37",
  },
  {
    label: "Furniture and Related Product Mfg",
    value: "38",
  },
  {
    label: "Gasoline Stations",
    value: "39",
  },
  {
    label: "General Merchandise Stores",
    value: "40",
  },
  {
    label: "Goods-Producing Industries",
    value: "41",
  },
  {
    label: "Health Care and Social Assistance",
    value: "42",
  },
  {
    label: "Health and Personal Care Stores",
    value: "43",
  },
  {
    label: "Heavy and Civil Engineering Construction",
    value: "44",
  },
  {
    label: "Hospitals",
    value: "45",
  },
  {
    label: "Information",
    value: "46",
  },
  {
    label: "Insurance Carriers",
    value: "47",
  },
  {
    label: "Internet Publishing and Broadcasting",
    value: "48",
  },
  {
    label: "Leather and Allied Product Mfg",
    value: "49",
  },
  {
    label: "Leisure and Hospitality",
    value: "50",
  },
  {
    label: "Lessors of Nonfinancial Intangible Assets",
    value: "51",
  },
  {
    label: "Machinery Manufacturing",
    value: "52",
  },
  {
    label: "Management of Companies and Enterprises",
    value: "53",
  },
  {
    label: "Manufacturing",
    value: "54",
  },
  {
    label: "Merchant Wholesalers, Durable Goods",
    value: "55",
  },
  {
    label: "Merchant Wholesalers, Nondurable Goods",
    value: "56",
  },
  {
    label: "Mining (except Oil and Gas)",
    value: "57",
  },
  {
    label: "Mining, Quarrying, and Oil Extraction",
    value: "58",
  },
  {
    label: "Miscellaneous Manufacturing",
    value: "59",
  },
  {
    label: "Miscellaneous Store Retailers",
    value: "60",
  },
  {
    label: "Monetary Authorities - Central Bank",
    value: "61",
  },
  {
    label: "Motion Picture & Sound Recording",
    value: "62",
  },
  {
    label: "Motor Vehicle and Parts Dealers",
    value: "63",
  },
  {
    label: "Museums & Historical Sites",
    value: "64",
  },
  {
    label: "Natural Resources and Mining",
    value: "65",
  },
  {
    label: "Nonmetallic Mineral Product Mfg",
    value: "66",
  },
  {
    label: "Nonstore Retailers",
    value: "67",
  },
  {
    label: "Nursing and Residential Care Facilities",
    value: "68",
  },
  {
    label: "Oil and Gas Extraction",
    value: "69",
  },
  {
    label: "Other Information Services",
    value: "70",
  },
  {
    label: "Other Services",
    value: "71",
  },
  {
    label: "Paper Manufacturing",
    value: "72",
  },
  {
    label: "Performing Arts & Spectator Sports",
    value: "73",
  },
  {
    label: "Personal and Laundry Services",
    value: "74",
  },
  {
    label: "Petroleum and Coal Products Mfg",
    value: "75",
  },
  {
    label: "Pipeline Transportation",
    value: "76",
  },
  {
    label: "Plastics and Rubber Products Mfg",
    value: "77",
  },
  {
    label: "Postal Service",
    value: "78",
  },
  {
    label: "Primary Metal Manufacturing",
    value: "79",
  },
  {
    label: "Printing and Related Support Activities",
    value: "80",
  },
  {
    label: "Private Households",
    value: "81",
  },
  {
    label: "Professional and Business Services",
    value: "82",
  },
  {
    label: "Professional, Scientific, & Tech Services",
    value: "83",
  },
  {
    label: "Publishing Industries",
    value: "84",
  },
  {
    label: "Rail Transportation",
    value: "85",
  },
  {
    label: "Real Estate",
    value: "86",
  },
  {
    label: "Real Estate and Rental and Leasing",
    value: "87",
  },
  {
    label: "Religious, Grantmaking, Civic Orgs",
    value: "88",
  },
  {
    label: "Rental and Leasing Services",
    value: "89",
  },
  {
    label: "Repair and Maintenance",
    value: "90",
  },
  {
    label: "Retail Trade",
    value: "91",
  },
  {
    label: "Scenic and Sightseeing Transportation",
    value: "92",
  },
  {
    label: "Securities, Commodity Contracts & Investments",
    value: "93",
  },
  {
    label: "Service-Providing Industries",
    value: "94",
  },
  {
    label: "Social Assistance",
    value: "95",
  },
  {
    label: "Specialty Trade Contractors",
    value: "96",
  },
  {
    label: "Sporting Goods, Hobby, Book Stores",
    value: "97",
  },
  {
    label: "Support Activities for Agriculture",
    value: "98",
  },
  {
    label: "Support Activities for Mining",
    value: "99",
  },
  {
    label: "Support Activities for Transportation",
    value: "100",
  },
  {
    label: "Telecommunications",
    value: "101",
  },
  {
    label: "Textile Mills",
    value: "102",
  },
  {
    label: "Textile Product Mills",
    value: "103",
  },
  {
    label: "Trade, Transportation, and Utilities",
    value: "104",
  },
  {
    label: "Transit and Ground Passenger Transportation",
    value: "105",
  },
  {
    label: "Transportation Equipment Mfg",
    value: "106",
  },
  {
    label: "Transportation and Warehousing",
    value: "107",
  },
  {
    label: "Truck Transportation",
    value: "108",
  },
  {
    label: "Utilities",
    value: "109",
  },
  {
    label: "Warehousing and Storage",
    value: "110",
  },
  {
    label: "Waste Management and Remediation Services",
    value: "111",
  },
  {
    label: "Water Transportation",
    value: "112",
  },
  {
    label: "Wholesale Electronic Markets",
    value: "113",
  },
  {
    label: "Wholesale Trade",
    value: "114",
  },
  {
    label: "Wood Product Manufacturing",
    value: "115",
  },
];

const targetObjectiveOptions = [
  {
    label: "App Installs / Downloads",
    value: "1",
  },
  {
    label: "Audience Building",
    value: "2",
  },
  {
    label: "Brand Awareness & Recall",
    value: "3",
  },
  {
    label: "Customer Acquisition / Sales",
    value: "4",
  },
  {
    label: "Free Trial or Freemium Signups",
    value: "5",
  },
  {
    label: "Lead Generation (Top/Mid-Funnel)",
    value: "6",
  },
  {
    label: "Loyalty & Referral Program Growth",
    value: "7",
  },
  {
    label: "Market & Customer Research",
    value: "8",
  },
  {
    label: "New Market Entry",
    value: "9",
  },
  {
    label: "Partner & Affiliate Recruitment",
    value: "10",
  },
  {
    label: "Product Engagement & Feature Adoption",
    value: "11",
  },
  {
    label: "Sales-Ready Leads",
    value: "12",
  },
  {
    label: "Upsell / Cross-sell Revenue",
    value: "13",
  },
  {
    label: "User Retention & Churn Reduction",
    value: "14",
  },
  {
    label: "Waitlist / Pre-order Signups",
    value: "15",
  },
  {
    label: "Website / App Traffic Acquisition",
    value: "16",
  },
];

export default {
  key: "apexverify-unit-verification",
  name: "ApexVerify - Email/Phone/Address B2B Data Verification",
  description: "Verify a single email address, phone number, or address using ApexVerify. [See the documentation](https://documentation.apexverify.com/api-reference/apex-verify-api/unit)",
  version: "0.0.3",
  type: "action",
  props: {
    apexverify,

    type: {
      type: "string",
      label: "Data Type",
      description: "Select whether you are verifying an email address or a phone number.",
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
      description: "Enter the email address or phone number to verify.",
    },
    targetCountry: {
      type: "string",
      label: "Target Country",
      description: "Country against which the email or phone should be processed.",
      default: "US",
      options: countryOptions,
    },
    targetAudience: {
      type: "string",
      label: "Target Audience",
      description: "Optional target audience context for the verification. Accepted values include `1` for Agency / Consultants, `4` for Developers & Technical Leads, `8` for Founders & C-Level Executives, and `17` for Marketing & Sales Professionals.",
      optional: true,
      options: targetAudienceOptions,
    },
    targetMarketIndustry: {
      type: "string",
      label: "Target Market Industry",
      description: "Optional market industry context for the verification. Accepted values include `18` for Construction, `29` for Finance and Insurance, `42` for Health Care and Social Assistance, `46` for Information, and `91` for Retail Trade.",
      optional: true,
      options: targetMarketIndustryOptions,
    },
    targetObjective: {
      type: "string",
      label: "Target Objective",
      description: "Optional campaign or business objective context for the verification. Accepted values include `4` for Customer Acquisition / Sales, `6` for Lead Generation (Top/Mid-Funnel), `12` for Sales-Ready Leads, and `16` for Website / App Traffic Acquisition.",
      optional: true,
      options: targetObjectiveOptions,
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

    const response = await this.apexverify._makeRequest($, {
      method: "POST",
      path: "/v1/unit",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });

    $.export("$summary", `Successfully verified ${this.type}: ${this.unit}`);

    return response;
  },
};
