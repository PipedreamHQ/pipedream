// legacy_hash_id: a_VpiVXP
import { axios } from "@pipedream/platform";

export default {
  key: "mailerlite-subscribe-to-group",
  name: "Subscribe to MailerLite Group",
  description: "Subscribe to the mailer lite group with given group, email, anem",
  version: "0.2.1",
  type: "action",
  props: {
    mailerlite: {
      type: "app",
      app: "mailerlite",
    },
    groupId: {
      type: "string",
    },
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `https://api.mailerlite.com/api/v2/groups/${this.groupId}/subscribers`,
      headers: {
        "X-MailerLite-ApiKey": `${this.mailerlite.$auth.api_key}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        "name": this.name,
        "email": this.email,
      }),
    }).then((response) => {
      return response.id;
    });
  },
};
