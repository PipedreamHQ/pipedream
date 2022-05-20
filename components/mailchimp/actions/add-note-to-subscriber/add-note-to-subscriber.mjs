// legacy_hash_id: a_wdijlV
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-add-note-to-subscriber",
  name: "Add Note to Subscriber",
  description: "Adds a new note to an existing subscriber.",
  version: "0.2.2",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique ID for the list.",
    },
    subscriberHash: {
      label: "Subscriber Hash",
      type: "string",
      description: "The MD5 hash of the lowercase version of the list member's email address.",
    },
    note: {
      label: "Note",
      type: "string",
      description: "The content of the note. Note length is limited to 1,000 characters.",
    },
  },
  async run({ $ }) {
    const payload = {
      listId: this.listId,
      subscriberHash: this.subscriberHash,
    };

    const response = await this.mailchimp.addNoteToListMember($, payload);
    response && $.export("$summary", "Note added successfully");
    return response;
  },
};
