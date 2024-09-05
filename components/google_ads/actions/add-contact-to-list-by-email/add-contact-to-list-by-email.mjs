import crypto from "crypto";
import googleAds from "../../google_ads.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_ads-add-contact-to-list-by-email",
  name: "Add Contact to Customer List by Email",
  description: "Adds a contact to a specific customer list in Google Ads. Lists typically update in 6 to 12 hours after operation. [See the documentation](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started)",
  version: "0.1.1",
  type: "action",
  props: {
    ...common.props,
    contactEmail: {
      propDefinition: [
        googleAds,
        "contactEmail",
      ],
    },
    userListId: {
      propDefinition: [
        googleAds,
        "userListId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      googleAds, accountId, customerClientId, contactEmail, userListId,
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
          type: "CUSTOMER_MATCH_USER_LIST",
        },
      },
    });

    await googleAds.addContactToCustomerList({
      $,
      accountId,
      customerClientId,
      path: offlineUserDataJob.resourceName,
      data: {
        operations: [
          {
            create: {
              userIdentifiers: [
                {
                  hashedEmail: crypto.createHash("sha256").update(contactEmail)
                    .digest("hex"),
                },
              ],
            },
          },
        ],
      },
    });

    const response = await googleAds.runOfflineUserDataJob({
      $,
      accountId,
      customerClientId,
      path: offlineUserDataJob.resourceName,
    });

    $.export("$summary", `Added contact ${contactEmail} to user list ${userListId}`);
    return response;
  },
};
