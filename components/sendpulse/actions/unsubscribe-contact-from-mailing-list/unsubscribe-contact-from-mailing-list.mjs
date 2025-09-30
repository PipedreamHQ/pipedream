// legacy_hash_id: a_Xzi2Kp
import { axios } from "@pipedream/platform";

export default {
  key: "sendpulse-unsubscribe-contact-from-mailing-list",
  name: "Unsubscribe a Contact From a Defined Mailing List",
  description: "Make a POST request to https://api.sendpulse.com/addressbooks/{id}/emails/unsubscribe",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendpulse: {
      type: "app",
      app: "sendpulse",
    },
    id: {
      type: "string",
      description: "The mailing list ID",
    },
    emails: {
      type: "string",
      description: "The contact that you want to unsubscribe from the defined mailing list [\"example@yourdomain.com\"]",
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "POST",
      url: "https://api.sendpulse.com/blacklist",
      headers: {
        Authorization: `Bearer ${this.sendpulse.$auth.oauth_access_token}`,
      },
      data: {
        id: this.id,
        emails: this.emails,
      },
    });
  },
};
