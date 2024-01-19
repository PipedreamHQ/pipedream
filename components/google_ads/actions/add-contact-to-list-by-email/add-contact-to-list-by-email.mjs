import crypto from "crypto";
import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-add-contact-to-list-by-email",
  name: "Add Contact to Customer List by Email",
  description: "Adds a contact to a specific customer list in Google Ads. Lists typically update in 6 to 12 hours after operation. [See the documentation](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started)",
  version: "0.0.1",
  type: "action",
  props: {
    googleAds,
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
      ],
    },
  },
  async run({ $ }) {
    const offlineUserDataJob = await this.googleAds.createOfflineUserDataJob({
      data: {
        job: {
          customerMatchUserListMetadata: {
            userList: `customers/${this.googleAds.$auth.login_customer_id}/userLists/${this.userListId}`,
          },
          type: "CUSTOMER_MATCH_USER_LIST",
        },
      },
    });

    await this.googleAds.addContactToCustomerList({
      $,
      path: offlineUserDataJob.resourceName,
      data: {
        operations: [
          {
            create: {
              userIdentifiers: [
                {
                  hashedEmail: crypto.createHash("sha256").update(this.contactEmail)
                    .digest("hex"),
                },
              ],
            },
          },
        ],
      },
    });

    const response = await this.googleAds.runOfflineUserDataJob({
      $,
      path: offlineUserDataJob.resourceName,
    });

    $.export("$summary", `Added contact ${this.contactEmail} to the user list ${this.userListId}`);
    return response;
  },
};
