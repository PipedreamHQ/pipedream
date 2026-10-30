import app from "../../less_annoying_crm.app.mjs";

export default {
  key: "less_annoying_crm-create-note",
  name: "Create Note",
  description: "Adds a note to a contact or company's history in Less Annoying CRM."
    + " Get the `contactId` from **Search Contacts** first; the record must already exist. For a lead, use the `ContactId` on the pipeline item."
    + " `note` is plain text (new lines are kept; HTML and Markdown are escaped, not rendered)."
    + " To log a note while moving a lead to a new status, use **Update Pipeline Item** with its `note` parameter instead."
    + " Returns the new `NoteId`."
    + " Example: `contactId: \"1234567890123456789012345678901\", note: \"Called Jane; she wants a quote by Friday.\"` returns `{\"NoteId\": \"1234567890123456789012345678908\"}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Notes#Goto-CreateNote)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "Plain-text note content, e.g. `Called Jane about the quote.`",
    },
    dateDisplayedInHistory: {
      type: "string",
      label: "Date Displayed in History",
      description: "When the note should appear in the contact's history, as ISO 8601 (e.g. `2025-07-25T16:00:00-05:00`). Defaults to now.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createNote({
      $,
      parameters: {
        ContactId: this.contactId,
        Note: this.note,
        DateDisplayedInHistory: this.dateDisplayedInHistory,
      },
    });

    $.export("$summary", `Created note ${response.NoteId} on contact ${this.contactId}`);
    return response;
  },
};
