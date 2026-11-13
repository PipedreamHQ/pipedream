import { ConfigurationError } from "@pipedream/platform";
import app from "../../proweblook.app.mjs";

const E164_PHONE_REGEX = /^\+[1-9]\d{5,15}$/;

export default {
  key: "proweblook-check-whatsapp",
  name: "Check WhatsApp",
  description: "Check whether an international E.164 phone number is registered on WhatsApp without sending any OTP or message."
    + " Requires `phoneNumber` to include a leading `+` country code prefix (e.g. `+12025550123`)."
    + " Returns `data.verdict` (`on_whatsapp` or `not_on_whatsapp`), `data.reason`, and `data.details`."
    + " If you have a local number without a `+` prefix, call **Validate Phone** first with a `countryCode` to normalize it, or call **Get Balance** to check remaining WhatsApp credits."
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
      label: "Phone Number (E.164)",
      description: "Phone number in international E.164 format starting with `+`, e.g. `+12025550123`.",
    },
  },
  async run({ $ }) {
    const phoneNumber = this.phoneNumber?.trim();
    if (!phoneNumber || !E164_PHONE_REGEX.test(phoneNumber)) {
      throw new ConfigurationError("Phone Number must be in international E.164 format starting with `+`, e.g. `+12025550123`.");
    }

    const response = await this.app.checkWhatsapp({
      $,
      data: {
        phone_number: phoneNumber,
      },
    });

    $.export("$summary", `Checked WhatsApp registration for ${phoneNumber}: ${response?.data?.verdict || "completed"}`);
    return response;
  },
};
