import { ConfigurationError } from "@pipedream/platform";
import mercury from "../../mercury.app.mjs";
import {
  ELECTRONIC_ACCOUNT_TYPES,
  PAYMENT_METHODS,
} from "../../common/constants.mjs";

export default {
  key: "mercury-add-recipient",
  name: "Add Recipient",
  description: "Create a new Mercury payment recipient. Provide **Recipient Name** and **Emails** for a basic contact. To attach bank details, set **Payment Method** and the matching fields: `ach` needs Account Number, Routing Number, Electronic Account Type, and the address fields; `domesticWire` needs Account Number, Routing Number, and the address fields; `check` needs only the address fields. All numeric-looking values (account number, routing number, postal code) are sent to Mercury as strings (individual string props, so leading zeros are preserved). Example: `recipientName=\"Art Vandelay\"`, `emails=[\"art@vandelayindustries.com\"]`, `paymentMethod=\"ach\"`, `accountNumber=\"123456789\"`, `routingNumber=\"021000021\"`, `electronicAccountType=\"businessChecking\"`, `addressLine1=\"100 Federal Street\"`, `city=\"Boston\"`, `region=\"MA\"`, `postalCode=\"02101\"`, `country=\"US\"` -> returns the created recipient `{ id: \"b56db170-927b-11f1-a805-27c2879b4c72\", name: \"Art Vandelay\", ... }` (the `id` is a UUID, not a prefixed string). [See the documentation](https://docs.mercury.com/reference/createrecipient)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "Recipient name (e.g. `Acme Corp`).",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "One or more recipient email addresses (e.g. `[\"billing@acme.com\"]`). Required by the API.",
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Which bank details to attach: `ach`, `domesticWire`, or `check`. Usually optional — it is inferred from the fields you provide (Electronic Account Type -> `ach`; address only -> `check`). Set it explicitly only to disambiguate an `ach` vs `domesticWire` recipient when no Electronic Account Type is given, or to force a specific method.",
      options: PAYMENT_METHODS,
      optional: true,
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "Bank account number. Required for `ach` and `domesticWire`. Sent to Mercury as a string.",
      optional: true,
    },
    routingNumber: {
      type: "string",
      label: "Routing Number",
      description: "9-digit ABA routing number (e.g. `021000021`). Required for `ach` and `domesticWire`. Sent to Mercury as a string, so leading zeros are preserved.",
      optional: true,
    },
    electronicAccountType: {
      type: "string",
      label: "Electronic Account Type",
      description: "ACH account type. One of `businessChecking`, `businessSavings`, `personalChecking`, `personalSavings`. Required for `ach`. NOTE: Mercury does not accept plain `checking`/`savings`.",
      options: ELECTRONIC_ACCOUNT_TYPES,
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "Street address (e.g. `100 Federal Street`). Required when a **Payment Method** is set.",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "Optional second address line (e.g. `Apt 5A`, `Suite 400`).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City (e.g. `Boston`). Required when a **Payment Method** is set.",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "State or region code (e.g. `MA`). Required when a **Payment Method** is set.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal / ZIP code (e.g. `02101`). Required when a **Payment Method** is set. Sent to Mercury as a string, so leading zeros are preserved.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code (e.g. `US`). Required when a **Payment Method** is set.",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Optional primary contact email.",
      optional: true,
    },
    nickname: {
      type: "string",
      label: "Nickname",
      description: "Optional recipient nickname.",
      optional: true,
    },
  },
  async run({ $ }) {
    const trim = (v) => (typeof v === "string"
      ? v.trim() || undefined
      : v ?? undefined);

    const accountNumber = trim(this.accountNumber);
    const routingNumber = trim(this.routingNumber);
    const electronicAccountType = trim(this.electronicAccountType);
    const address = {
      address1: trim(this.addressLine1),
      address2: trim(this.addressLine2),
      city: trim(this.city),
      region: trim(this.region),
      postalCode: trim(this.postalCode),
      country: trim(this.country),
    };
    // Required address fields per the Mercury schema (address2 is optional).
    const requiredAddressFields = [
      "address1",
      "city",
      "region",
      "postalCode",
      "country",
    ];
    const hasAddressInput = Object.values(address).some((v) => v);

    // Infer the routing method from the supplied fields when not set explicitly.
    // `electronicAccountType` is unique to ACH, so it disambiguates ACH from wire.
    let method = this.paymentMethod;
    if (!method) {
      if (electronicAccountType) {
        method = "ach";
      } else if (accountNumber || routingNumber) {
        throw new ConfigurationError("Set **Payment Method** to `ach` or `domesticWire` — the account/routing details you provided match either an ACH or a domestic wire recipient (for `ach`, also provide **Electronic Account Type**).");
      } else if (hasAddressInput) {
        method = "check";
      }
    }

    const buildAddress = () => {
      const missing = requiredAddressFields.filter((f) => !address[f]);
      if (missing.length) {
        throw new ConfigurationError(`Address fields are required for \`${method}\` recipients. Missing: ${missing.join(", ")}.`);
      }
      // Omit an empty optional address2 rather than sending undefined.
      const built = {
        ...address,
      };
      if (!built.address2) {
        delete built.address2;
      }
      return built;
    };

    let electronicRoutingInfo;
    let domesticWireRoutingInfo;
    let checkInfo;

    if (method === "ach") {
      if (!accountNumber || !routingNumber || !electronicAccountType) {
        throw new ConfigurationError("ACH recipients require **Account Number**, **Routing Number**, and **Electronic Account Type**.");
      }
      electronicRoutingInfo = {
        accountNumber,
        routingNumber,
        electronicAccountType,
        address: buildAddress(),
      };
    } else if (method === "domesticWire") {
      if (electronicAccountType) {
        throw new ConfigurationError("**Electronic Account Type** applies only to `ach` recipients; remove it for `domesticWire`.");
      }
      if (!accountNumber || !routingNumber) {
        throw new ConfigurationError("Domestic wire recipients require **Account Number** and **Routing Number**.");
      }
      domesticWireRoutingInfo = {
        accountNumber,
        routingNumber,
        address: buildAddress(),
      };
    } else if (method === "check") {
      if (accountNumber || routingNumber || electronicAccountType) {
        throw new ConfigurationError("`check` recipients take only address fields; remove **Account Number**, **Routing Number**, and **Electronic Account Type**.");
      }
      checkInfo = {
        address: buildAddress(),
      };
    }

    const recipient = await this.mercury.createRecipient({
      $,
      data: {
        name: this.recipientName,
        emails: this.emails,
        electronicRoutingInfo,
        checkInfo,
        domesticWireRoutingInfo,
        contactEmail: this.contactEmail,
        nickname: this.nickname,
      },
    });
    $.export("$summary", `Successfully created recipient ${recipient.id}: ${this.recipientName}`);
    return recipient;
  },
};
