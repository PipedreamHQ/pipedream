// legacy_hash_id: a_74iE5o
import { axios } from "@pipedream/platform";

export default {
  key: "mailchimp-add-subscriber-to-tag",
  name: "Add Subscriber to Tag",
  description: "Adds an email address to a tag within an audience.",
  version: "0.2.1",
  type: "action",
  props: {
    mailchimp: {
      type: "app",
      app: "mailchimp",
    },
    list_id: {
      type: "string",
      description: "The unique ID for the list.",
    },
    subscriber_hash: {
      type: "string",
      description: "The MD5 hash of the lowercase version of the list member's email address.",
    },
    name: {
      type: "string",
      description: "The name of the tag.",
    },
    status: {
      type: "string",
      description: "The status for the tag on the member, pass in active to add a tag or inactive to remove it.",
      options: [
        "active",
        "inactive",
      ],
    },
  },
  async run({ $ }) {
    let listId = this.list_id;
    let subscriberHash = this.subscriber_hash;

    return await axios($, {
      url: `https://${this.mailchimp.$auth.dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}/tags`,
      headers: {
        Authorization: `Bearer ${this.mailchimp.$auth.oauth_access_token}`,
      },
      method: "POST",
      data: {
        "tags": [
          {
            "name": this.name,
            "status": this.status,
          },
        ],
      },
    });
  },
};
