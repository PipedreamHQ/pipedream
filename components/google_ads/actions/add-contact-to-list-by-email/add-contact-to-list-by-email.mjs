import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";
import {
  CRM_BASED_USER_LIST_TYPE,
  CUSTOMER_MATCH_USER_LIST_TYPE,
  GMAIL_NORMALIZED_DOMAINS,
} from "../../common/constants.mjs";

// Google's ceiling on identifiers in a single AddOfflineUserDataJobOperations request.
const MAX_IDENTIFIERS_PER_REQUEST = 100000;

export default {
  ...common,
  key: "google_ads-add-contact-to-list-by-email",
  name: "Add Contact to Customer List by Email",
  description: "Adds one or more contacts to a Google Ads Customer Match user list by email. Accepts an array of email addresses and batches them all into a single offline user data job (one lookup to confirm the target list is a Customer Match list + one create + one addOperations + one run = exactly 4 API calls per run regardless of list size). Emails are normalized (trimmed, lowercased; Gmail/Googlemail addresses additionally have dots removed from the local part and plus-suffixes stripped) before SHA-256 hashing so they match Google's expected Customer Match hash. Lists typically update in 6 to 12 hours after the operation. Use **List User Lists** to find a valid Customer List ID and confirm it's a Customer Match (`CRM_BASED`) list before calling this action. [See the documentation](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "Array of email addresses to add to the Customer Match list, e.g. `[\" Test.User+promo@Gmail.com \", \"ALICE@EXAMPLE.COM\"]`. Each is normalized before hashing: whitespace is trimmed and the address is lowercased for all domains; for Gmail/Googlemail addresses (`gmail.com`, `googlemail.com`), dots are also removed from the local part and any `+suffix` is stripped. All emails are submitted in one batched job. Google caps a single AddOfflineUserDataJobOperations request at 100,000 identifiers; arrays larger than that are rejected — split into multiple calls instead.",
    },
    userListId: {
      type: "string",
      label: "Customer List ID",
      description: "The numeric Customer List (user list) ID to add the contacts to, e.g. `98765432`. Run **List User Lists** first to find valid IDs and confirm the target list's type is `CRM_BASED` (Customer Match) — this action rejects any other list type.",
    },
  },
  methods: {
    ...common.methods,
    normalizeEmail(email) {
      const trimmedLower = email.trim().toLowerCase();
      const atIndex = trimmedLower.indexOf("@");
      if (atIndex === -1) {
        return trimmedLower;
      }
      const domain = trimmedLower.slice(atIndex + 1);
      let localPart = trimmedLower.slice(0, atIndex);
      if (GMAIL_NORMALIZED_DOMAINS.includes(domain)) {
        const plusIndex = localPart.indexOf("+");
        if (plusIndex !== -1) {
          localPart = localPart.slice(0, plusIndex);
        }
        localPart = localPart.replace(/\./g, "");
      }
      return `${localPart}@${domain}`;
    },
    hashEmail(email) {
      const normalized = this.normalizeEmail(email);
      return crypto.createHash("sha256").update(normalized)
        .digest("hex");
    },
  },
  async run({ $ }) {
    const {
      googleAds, accountId, customerClientId, emails, userListId,
    } = this;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmails = [];
    const invalidEmails = [];
    for (const email of emails) {
      const trimmed = email.trim();
      if (!trimmed || !emailRegex.test(trimmed)) {
        invalidEmails.push(email);
        continue;
      }
      trimmedEmails.push(trimmed);
    }
    if (invalidEmails.length) {
      throw new ConfigurationError(`Invalid email address${invalidEmails.length === 1
        ? ""
        : "es"}: ${invalidEmails.map((email) => `\`${email}\``).join(", ")}. Each entry must be a non-blank, structurally valid email address with no internal whitespace.`);
    }

    if (trimmedEmails.length > MAX_IDENTIFIERS_PER_REQUEST) {
      throw new ConfigurationError(`Got ${trimmedEmails.length} email addresses, but Google caps a single AddOfflineUserDataJobOperations request at ${MAX_IDENTIFIERS_PER_REQUEST} identifiers. Split the list into batches of at most ${MAX_IDENTIFIERS_PER_REQUEST} and call this action once per batch.`);
    }

    const trimmedUserListId = userListId.trim();
    if (!/^\d+$/.test(trimmedUserListId)) {
      throw new ConfigurationError(`Customer List ID \`${userListId}\` must be a plain decimal number, e.g. \`98765432\`.`);
    }
    const canonicalUserListId = BigInt(trimmedUserListId).toString();

    const [
      userList,
    ] = await googleAds.listUserLists({
      $,
      id: canonicalUserListId,
      accountId,
      customerClientId,
    }) ?? [];

    if (userList?.userList?.type !== CRM_BASED_USER_LIST_TYPE) {
      throw new ConfigurationError(`User List \`${canonicalUserListId}\` is not a Customer Match list (type: \`${userList?.userList?.type ?? "not found"}\`). Only Customer Match lists are supported by this action. Use **List User Lists** to check a list's type before calling this action.`);
    }

    const offlineUserDataJob = await googleAds.createOfflineUserDataJob({
      $,
      accountId,
      customerClientId,
      data: {
        job: {
          customerMatchUserListMetadata: {
            userList: `customers/${customerClientId ?? accountId}/userLists/${canonicalUserListId}`,
          },
          type: CUSTOMER_MATCH_USER_LIST_TYPE,
        },
      },
    });

    const operations = trimmedEmails.map((email) => ({
      create: {
        userIdentifiers: [
          {
            hashedEmail: this.hashEmail(email),
          },
        ],
      },
    }));

    await googleAds.addContactToCustomerList({
      $,
      accountId,
      customerClientId,
      path: offlineUserDataJob.resourceName,
      data: {
        operations,
      },
    });

    const response = await googleAds.runOfflineUserDataJob({
      $,
      accountId,
      customerClientId,
      path: offlineUserDataJob.resourceName,
    });

    $.export("$summary", `Submitted ${trimmedEmails.length} contact(s) to user list ${canonicalUserListId}`);
    return response;
  },
};
