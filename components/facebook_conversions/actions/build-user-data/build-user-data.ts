import { defineAction } from "@pipedream/types";
import app from "../../app/facebook_conversions.app";
import { checkUserDataObject } from "../../common/methods";

export default defineAction({
  name: "Build User Data",
  description:
    "Construct the Customer Information object to send in an event. [See the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters)",
  key: "facebook_conversions-build-user-data",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      label: "Email",
      description: "Email Address. [See more on this and other props in the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters)",
      type: "string",
      optional: true,
    },
    phone: {
      label: "Phone Number",
      description:
        "Phone numbers must include a country code to be used for matching (e.g., the number 1 must precede a phone number in the United States). Always include the country code as part of your customers' phone numbers, even if all of your data is from the same country.",
      type: "string",
      optional: true,
    },
    firstName: {
      label: "First Name",
      description:
        "Using Roman alphabet a-z characters is recommended. Lowercase only with no punctuation. If using special characters, the text must be encoded in UTF-8 format.",
      type: "string",
      optional: true,
    },
    lastName: {
      label: "Last Name",
      description:
        "Using Roman alphabet a-z characters is recommended. Lowercase only with no punctuation. If using special characters, the text must be encoded in UTF-8 format.",
      type: "string",
      optional: true,
    },
    dateBirth: {
      label: "Date of Birth",
      description: `Facebook accepts the \`YYYYMMDD\` format accommodating a range of month, day and year combinations, with or without punctuation.
\
- Year: Use the YYYY format from 1900 to current year.
\
- Month: Use the MM format: 01 to 12.
\
- Date: Use the DD format: 01 to 31.`,
      type: "string",
      optional: true,
    },
    gender: {
      label: "Gender",
      description:
        "Facebook accepts gender in the form of an initial in lowercase. Example: `f` for female, `m` for male",
      type: "string",
      optional: true,
    },
    city: {
      label: "City",
      description:
        "Using Roman alphabet a-z characters is recommended. Lowercase only with no punctuation, no special characters, and no spaces. Example: `paris`, `london`, `newyork`",
      type: "string",
      optional: true,
    },
    state: {
      label: "State",
      description:
        "Use the [2-character ANSI abbreviation code](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standard_state_code) in lowercase. Normalize states outside the U.S. in lowercase with no punctuation, no special characters, and no spaces. Example: `az`, `ca`",
      type: "string",
      optional: true,
    },
    zipCode: {
      label: "Zip Code",
      description:
        "Use lowercase with no spaces and no dash. Use only the first 5 digits for U.S. zip codes. Use the area, district, and sector format for the UK. Example: U.S zip code - `94035`, UK zip code - `m11ae`",
      type: "string",
      optional: true,
    },
    country: {
      label: "Country",
      description:
        "Use the [lowercase, 2-letter country codes in ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). **Important Note:** Always include your customers' countries' even if all of your country codes are from the same country. Facebook matches on a global scale, and this simple step helps them match as many Accounts Center accounts as possible from your list.",
      type: "string",
      optional: true,
    },
    externalId: {
      label: "External ID",
      description:
        "Any unique ID from the advertiser, such as loyalty membership IDs, user IDs, and external cookie IDs.",
      type: "string",
      optional: true,
    },
    clientIpAddress: {
      label: "Client IP Address",
      description:
        "The IP address of the browser corresponding to the event must be a valid IPV4 or IPV6 address. IPV6 is preferable over IPV4 for IPV6-enabled users. No spaces should be included. Example: IPV4 - `168.212.226.204`, IPV6 - `2001:0db8:85a3:0000:0000:8a2e:0370:7334`",
      type: "string",
      optional: true,
    },
    clientUserAgent: {
      label: "Client User Agent",
      description:
        "The user agent for the browser corresponding to the event. Example: `Mozilla/5.0 (Windows NT 10.0; Win64; x64)`, `AppleWebKit/537.36 (KHTML, like Gecko)`, `Chrome/87.0.4280.141`, `Safari/537.36`",
      type: "string",
      optional: true,
    },
    clickId: {
      label: "Click ID",
      description:
        "The Facebook click ID value is stored in the `_fbc` browser cookie under your domain. See [Managing fbc and fbp Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc) for how to get this value or generate this value from a fbclid query parameter.",
      type: "string",
      optional: true,
    },
    browserId: {
      label: "Browser ID",
      description:
        "The Facebook browser ID value is stored in the `_fbp` browser cookie under your domain. See [Managing fbc and fbp Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc) for how to get this value or generate this value from a fbclid query parameter.",
      type: "string",
      optional: true,
    },
    subscriptionId: {
      label: "Subscription ID",
      description:
        "The subscription ID for the user in this transaction; it is similar to the order ID for an individual product.",
      type: "string",
      optional: true,
    },
    fbLoginId: {
      label: "Facebook Login ID",
      description:
        "The ID issued by Meta when a person first logs into an instance of an app. This is also known as App-Scoped ID.",
      type: "integer",
      optional: true,
    },
    leadId: {
      label: "Lead ID",
      description:
        "The ID associated with a lead generated by [Meta's Lead Ads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads).",
      type: "integer",
      optional: true,
    },
    anonId: {
      label: "anon_id",
      description:
        "Your install ID. This field represents unique application installation instances.",
      type: "string",
      optional: true,
    },
    madId: {
      label: "madid",
      description:
        "Your mobile advertiser ID, the advertising ID from an Android device or the Advertising Identifier (IDFA) from an Apple device.",
      type: "string",
      optional: true,
    },
  },
  methods: {
    checkUserDataObject,
  },
  async run({ $ }) {
    const em = this.email?.trim().toLowerCase();
    const ph = this.phone?.replace(/[^0-9]/g, "");
    const fn = this.firstName?.toLowerCase();
    const ln = this.lastName?.toLowerCase();
    const db = this.dateBirth?.replace(/[^0-9]/g, "");
    const ge = this.gender?.toLowerCase();
    const ct = this.city?.toLowerCase().replace(/[^a-z]/g, "");
    const st = this.state;
    const zp = this.zipCode?.toLowerCase().replace(/[^0-9a-z]/g, "");
    const country = this.country?.toLowerCase();
    const {
      externalId, clientIpAddress, clientUserAgent, clickId, browserId, subscriptionId, fbLoginId, leadId, anonId, madId,
    } = this;

    const obj = Object.fromEntries(Object.entries({
      em,
      ph,
      fn,
      ln,
      db,
      ge,
      ct,
      st,
      zp,
      country,
      external_id: externalId,
      client_ip_address: clientIpAddress,
      client_user_agent: clientUserAgent,
      fbc: clickId,
      fbp: browserId,
      subscription_id: subscriptionId,
      fb_login_id: fbLoginId,
      lead_id: leadId,
      anon_id: anonId,
      madid: madId,
    }).filter(([
      , v,
    ]) => v !== undefined));

    $.export("$summary", "Successfully built user data");
    return checkUserDataObject(obj);
  },
});
