import crypto from "crypto";
import common from "../common/common.mjs";
import {
  CUSTOMER_MATCH_USER_LIST_TYPE,
  GMAIL_NORMALIZED_DOMAINS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "google_ads-add-contact-to-list-by-email",
  name: "Add Contact to Customer List by Email",
  description: "Adds one or more contacts to a Google Ads Customer Match user list by email. Accepts an array of email addresses and batches them all into a single offline user data job (one create + one addOperations + one run = exactly 3 API calls per run regardless of list size). Emails are normalized (trimmed, lowercased; Gmail/Googlemail addresses additionally have dots removed from the local part and plus-suffixes stripped) before SHA-256 hashing so they match Google's expected Customer Match hash. Lists typically update in 6 to 12 hours after the operation. To find a valid Customer List ID, query your user lists in Google Ads first (no in-connector discovery action currently exists). [See the documentation](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started)",
  version: "0.1.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "Array of email addresses to add to the Customer Match list, e.g. `[\" Test.User+promo@Gmail.com \", \"ALICE@EXAMPLE.COM\"]`. Each is normalized before hashing: whitespace is trimmed and the address is lowercased for all domains; for Gmail/Googlemail addresses (`gmail.com`, `googlemail.com`), dots are also removed from the local part and any `+suffix` is stripped. All emails are submitted in one batched job. Google caps a single AddOfflineUserDataJobOperations request at 100,000 identifiers — keep the array under that limit.",
    },
    userListId: {
      type: "string",
      label: "Customer List ID",
      description: "The numeric Customer List (user list) ID to add the contacts to, e.g. `98765432`. Provide the numeric ID directly - look it up in the Google Ads UI under Audience Manager, or query the API. No in-connector list action is available yet.",
    },
  },
  methods: {
    ...common.methods,
    _normalizeEmail(email) {
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
    _hashEmail(email) {
      const normalized = this._normalizeEmail(email);
      return crypto.createHash("sha256").update(normalized)
        .digest("hex");
    },
  },
  async run({ $ }) {
    const {
      googleAds, accountId, customerClientId, emails, userListId,
    } = this;

    const offlineUserDataJob = await googleAds.createOfflineUserDataJob({
      $,
      accountId,
      customerClientId,
      data: {
        job: {
          customerMatchUserListMetadata: {
            userList: `customers/${customerClientId ?? accountId}/userLists/${userListId}`,
          },
          type: CUSTOMER_MATCH_USER_LIST_TYPE,
        },
      },
    });

    const operations = emails.map((email) => ({
      create: {
        userIdentifiers: [
          {
            hashedEmail: this._hashEmail(email),
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

    $.export("$summary", `Added ${emails.length} contact(s) to user list ${userListId}`);
    return response;
  },
};
