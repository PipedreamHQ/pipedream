// legacy_hash_id: a_wdijlV
import { axios } from "@pipedream/platform";

export default {
  key: "mailchimp-add-note-to-subscriber",
  name: "Add Note to Subscriber",
  description: "Adds a new note to an existing subscriber.",
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
    note: {
      type: "string",
      description: "The content of the note. Note length is limited to 1,000 characters.",
    },
  },
  async run({ $ }) {
    let listId = this.list_id;
    let subscriberHash = this.subscriber_hash;

    return await axios($, {
      url: `https://${this.mailchimp.$auth.dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}/notes`,
      headers: {
        Authorization: `Bearer ${this.mailchimp.$auth.oauth_access_token}`,
      },
      method: "POST",
      data: {
        "note": this.note,
      },
    });
  },
};
