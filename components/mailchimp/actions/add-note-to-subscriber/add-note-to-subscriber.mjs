import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-add-note-to-subscriber",
  name: "Add Note to Subscriber",
  description: "Adds a new note to an existing subscriber. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-notes/add-member-note/)",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailchimp,
    listId: {
      propDefinition: [
        mailchimp,
        "listId",
      ],
      label: "List Id",
      description: "The unique ID of the list",
    },
    subscriberHash: {
      propDefinition: [
        mailchimp,
        "subscriberHash",
        (c) => ({
          listId: c.listId,
        }),
      ],
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
      note: this.note,
    };
    const response = await this.mailchimp.addNoteToListMember($, payload);
    response && $.export("$summary", "Note added successfully");
    return response;
  },
};
