import { axios } from "@pipedream/platform";
import crypto from "crypto";
import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-add-contact-to-list-by-email",
  name: "Add Contact to Customer List by Email",
  description: "Adds a contact to a specific customer list in Google Ads. Lists typically update in 6 to 12 hours after operation. [See the documentation](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started)",
  version: "0.0.{{ts}}",
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
    const hashedEmail = this.googleAds._hashSha256(this.contactEmail.trim().toLowerCase());
    const operations = {
      operations: [
        {
          create: {
            resource_name: `customers/${this.googleAds.$auth.client_customer_id}/userLists/${this.userListId}`,
            crm_based_user_list: {
              upload_key_type: "CONTACT_INFO",
            },
            membership_life_span: 30,
            members: [
              {
                hashed_email: hashedEmail,
              },
            ],
          },
        },
      ],
    };

    const response = await this.googleAds._makeRequest({
      method: "POST",
      path: `/v8/customers/${this.googleAds.$auth.client_customer_id}/userLists:mutate`,
      headers: {
        "Content-Type": "application/json",
      },
      data: operations,
    });

    $.export("$summary", `Added contact ${this.contactEmail} to the user list ${this.userListId}`);
    return response;
  },
};
