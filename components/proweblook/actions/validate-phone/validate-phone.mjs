import { ConfigurationError } from "@pipedream/platform";
import app from "../../proweblook.app.mjs";

const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

export default {
  key: "proweblook-validate-phone",
  name: "Validate Phone",
  description: "Validate a phone number and retrieve carrier, line-type, and formatting metadata using ProWebLook."
    + " Accepts an international E.164 phone number (e.g. `+12025550123`) or a national number paired with a two-letter ISO `countryCode` (e.g. `2025550123` with `US`)."
    + " Returns `data.verdict` (`valid`, `invalid`, or `unknown`), `data.reason`, and `data.details`."
    + " Chain **Check WhatsApp** next to test whether a validated E.164 number is registered on WhatsApp, or use **Get Balance** to inspect remaining phone credits."
    + " [See the documentation](https://proweblook.com/openapi.json)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const phoneNumber = this.phoneNumber?.trim();
    if (!phoneNumber) {
      throw new ConfigurationError("Phone Number is required, e.g. `+12025550123`.");
    }

    const rawCountryCode = this.countryCode?.trim();
    let countryCode;
    if (rawCountryCode) {
      countryCode = rawCountryCode.toUpperCase();
      if (!COUNTRY_CODE_REGEX.test(countryCode)) {
        throw new ConfigurationError("Country Code must be a two-letter ISO 3166-1 alpha-2 code such as `US`, `GB`, or `IN`, or left blank.");
      }
    }

    const data = {
      phone_number: phoneNumber,
      ...(countryCode
        ? {
          country_code: countryCode,
        }
        : {}),
    };

    const response = await this.app.validatePhone({
      $,
      data,
    });

    $.export("$summary", `Validated phone ${phoneNumber}: ${response?.data?.verdict || "completed"}`);
    return response;
  },
};
