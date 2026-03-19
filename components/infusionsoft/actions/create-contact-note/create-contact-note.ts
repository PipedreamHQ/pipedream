import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { CreateContactNoteParams } from "../../types/requestParams";

export default defineAction({
  name: "Create Contact Note",
  description:
    "Create a new note for a contact in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Note/operation/createNote)",
  key: "infusionsoft-create-contact-note",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    contactId: {
      propDefinition: [
        infusionsoft,
        "contactId",
      ],
    },
    body: {
      type: "string",
      label: "Note Body",
      description: "The main content/description of the note",
      optional: false,
    },
    title: {
      type: "string",
      label: "Title",
      description: "A short subject/title of the note",
      optional: true,
    },
    userId: {
      propDefinition: [
        infusionsoft,
        "userId",
      ],
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description:
        "A label or category for the note type (e.g., Appointment, Call, Email, Fax, Letter, Other).",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const contactId = String(this.contactId ?? "").trim();
    if (!contactId) throw new Error("Contact ID is required");

    const noteBody = String(this.body).trim();
    if (!noteBody) throw new Error("Note body is required");

    const params: CreateContactNoteParams = {
      $,
      contactId,
      body: noteBody,
      userId: this.userId
        ? String(this.userId)
        : undefined,
      title: this.title,
      type: this.type,
    };

    const result = await this.infusionsoft.createContactNote(params);

    $.export("$summary", `Successfully created note for contact ${contactId}`);

    return result;
  },
});
